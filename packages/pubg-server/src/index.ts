require("dotenv-safe").config();
import Koa from "koa";
import Router from "koa-router";
import {
  HTTP_STATUS_OK,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} from "pubg-utils/src";

const PORT = process.env.PORT;

const server = async () => {
  const app = new Koa();

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || HTTP_STATUS_INTERNAL_SERVER_ERROR;
      ctx.app.emit("error", err, ctx);
    }
  });

  const router = new Router();

  router.get("/", async (ctx) => {
    ctx.body = "ok.";
    ctx.response.status = HTTP_STATUS_OK;
  });

  router.get("/api/tatus", async (ctx) => {
    ctx.body = "ok.";
    ctx.response.status = HTTP_STATUS_OK;
  });

  app.use(router.routes());

  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
};

server();
