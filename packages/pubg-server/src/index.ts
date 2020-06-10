require("dotenv-safe").config();
import cors from "@koa/cors";
import Koa from "koa";
import Router from "koa-router";
import { Player } from "pubg-model/types/Player";
import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
  HTTP_STATUS_TOO_MANY_REQUESTS,
} from "pubg-utils/src";
import { Database } from "./database";
import { PlayerDbController } from "./database/model/player";
import {
  cache,
  duplicatedPlayerCheck,
  importPlayerByName,
  importPlayerStats,
} from "./utils";

const PORT = process.env.PORT;

const compress = require("koa-compress");

const server = async () => {
  const result = await Database.connect();
  if (result.err) process.exit(1);

  const app = new Koa();

  app.use(
    compress({
      // @ts-ignore
      filter(content_type) {
        return /text/i.test(content_type);
      },
      threshold: 2048,
      gzip: {
        flush: require("zlib").Z_SYNC_FLUSH,
      },
      deflate: {
        flush: require("zlib").Z_SYNC_FLUSH,
      },
      br: false, // disable brotli
    })
  );

  app.use(cors());

  app.use(async (ctx, next) => {
    ctx.compress = true;
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || HTTP_STATUS_INTERNAL_SERVER_ERROR;
      ctx.app.emit("error", err, ctx);
    }
  });

  const router = new Router();

  router.get("/api/v1/status", async (ctx) => {
    ctx.body = "ok.";
    ctx.response.status = HTTP_STATUS_OK;
  });

  // router.get("/api/v1/players", async (ctx) => {
  //   const player = await PlayerDbController.find({});
  //   if (player.ok) {
  //     ctx.body = player.val;
  //   }
  // });

  router.get(
    "/api/v1/players/:id",
    duplicatedPlayerCheck,
    async (ctx, next) => {
      const returnPlayer = (player: Player) => {
        // remove fields from player object
        if (ctx.query.matches == "false") player.matches = [];
        if (ctx.query.stats == "false") player.stats = null;

        ctx.body = player;
        return next();
      };

      if (ctx.query.compress == "false") ctx.compress = false;

      const player = await PlayerDbController.findByName(ctx.params.id);

      // player found in db
      if (player.ok) {
        return returnPlayer(player.val);
      }

      // try to import player
      const importedPlayer = await importPlayerByName(ctx.params.id);

      if (importedPlayer.ok) {
        const result = await importPlayerStats(importedPlayer.val);
        if (result.ok) {
          // return imported player with stats
          return returnPlayer(result.val);
        } else {
          // return imported player without stats
          return returnPlayer(importedPlayer.val);
        }
      } else if (importedPlayer.err !== HTTP_STATUS_TOO_MANY_REQUESTS) {
        // add failed player request to cache
        cache.pubgPlayerNotFound.push(ctx.params.id);
      }

      ctx.response.status = HTTP_STATUS_NOT_FOUND;
    }
  );

  app.use(router.routes());

  app.listen(PORT, () =>
    console.log(`[Info]: server is running on port ${PORT}`)
  );
};

server();
