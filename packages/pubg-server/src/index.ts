require("dotenv-safe").config();
import cors from "@koa/cors";
import Koa from "koa";
import Router from "koa-router";
import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK,
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

const server = async () => {
  const result = await Database.connect();
  if (result.err) process.exit(1);

  const app = new Koa();

  app.use(cors());

  app.use(async (ctx, next) => {
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

  router.get("/api/v1/players", async (ctx) => {
    const player = await PlayerDbController.find({});
    if (player.ok) {
      ctx.body = player.val;
    }
  });

  router.get(
    "/api/v1/players/:id",
    duplicatedPlayerCheck,
    async (ctx, next) => {
      const player = await PlayerDbController.findByName(ctx.params.id);

      // player found in db
      if (player.ok) {
        ctx.body = player.val;
        return next();
      }

      // try to import player
      const importedPlayer = await importPlayerByName(ctx.params.id);

      if (importedPlayer.ok) {
        const result = await importPlayerStats(importedPlayer.val);
        if (result.ok) {
          // return imported player with stats
          ctx.body = result.val;
          return next();
        } else {
          // return imported player without stats
          ctx.body = importedPlayer.val;
          return next();
        }
      }

      // add failed player request to cache
      cache.pubgPlayerNotFound.push(ctx.params.id);

      ctx.response.status = HTTP_STATUS_NOT_FOUND;
    }
  );

  app.use(router.routes());

  app.listen(PORT, () =>
    console.log(`[Info]: server is running on port ${PORT}`)
  );
};

server();
