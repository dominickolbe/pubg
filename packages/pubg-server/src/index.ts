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

  router.get("/api/v1/players/:id", async (ctx) => {
    const player = await PlayerDbController.findByName(ctx.params.id);
    if (player.ok) {
      ctx.body = player.val;
    } else {
      ctx.response.status = HTTP_STATUS_NOT_FOUND;
    }
  });

  app.use(router.routes());

  app.listen(PORT, () =>
    console.log(`[Info]: server is running on port ${PORT}`)
  );
};

server();
