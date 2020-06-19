require("dotenv-safe").config();
import cors from "@koa/cors";
import Koa from "koa";
import Router from "koa-router";
import { IPlayer } from "pubg-model/types/Player";
import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_TOO_MANY_REQUESTS,
} from "pubg-utils/src";
import { Database } from "./database";
import { PlayerDbController, PlayerModel } from "./database/model/player";
import {
  cache,
  duplicatedPlayerCheck,
  importNewPlayer,
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

  router.get("/api/search", async (ctx) => {
    const players = await PlayerDbController.search(ctx.query.q);
    if (players.ok) {
      ctx.body = players.val;
    }
  });

  router.get("/api/players/:id", duplicatedPlayerCheck, async (ctx, next) => {
    const returnPlayer = (player: IPlayer) => {
      const resp = player.toObject();
      delete resp.matches;
      ctx.body = resp;
      return next();
    };

    const player = await PlayerModel.findOne({ name: ctx.params.id }).select(
      "-matches"
    );

    // return player if found
    if (player) {
      ctx.body = player;
      return next();
    }

    // try to import player
    const newPlayer = await importNewPlayer(ctx.params.id);

    if (newPlayer.ok) {
      const result = await importPlayerStats(newPlayer.val);
      if (result.ok) {
        // return imported player with stats
        return returnPlayer(result.val);
      } else {
        // return imported player without stats
        return returnPlayer(newPlayer.val);
      }
    } else if (newPlayer.err !== HTTP_STATUS_TOO_MANY_REQUESTS) {
      // TODO check if cache is still working
      // add failed player request to cache
      cache.pubgPlayerNotFound.push(ctx.params.id);
    }

    ctx.response.status = HTTP_STATUS_NOT_FOUND;
  });

  router.get("/api/players/:id/matches", async (ctx, next) => {
    const limit = parseInt(ctx.query.limit) ?? 10;
    const offset = parseInt(ctx.query.offset) ?? 0;

    const matches = await PlayerDbController.findMatches(
      { name: ctx.params.id },
      limit,
      offset
    );

    if (matches.ok) {
      ctx.body = matches.val;
      return next();
    }

    ctx.response.status = HTTP_STATUS_NOT_FOUND;
  });

  app.use(router.routes());

  app.listen(PORT, () =>
    console.log(`[Info]: server is running on port ${PORT}`)
  );
};

server();
