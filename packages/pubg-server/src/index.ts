require("dotenv-safe").config();

import KoaCors from "@koa/cors";
import Koa from "koa";
import { HTTP_STATUS_INTERNAL_SERVER_ERROR } from "pubg-utils/src";
import { setUpApi } from "./api";
import { CLIENT_ORIGIN, PORT } from "./constants";
import { Database } from "./database/mongo";
import { redisDatabase } from "./database/redis";
import { checkCacheHeader } from "./middleware/cache";

const Api = setUpApi({ prefix: "/api" });

const server = async () => {
  const result = await Database.connect();
  if (result.err) process.exit(1);

  redisDatabase.flushdb();

  const app = new Koa();

  app.use(checkCacheHeader);

  app.use(
    KoaCors({
      credentials: true,
      origin: CLIENT_ORIGIN,
      allowMethods: "GET",
    })
  );

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.log(err);
      ctx.status = err.status || HTTP_STATUS_INTERNAL_SERVER_ERROR;
      ctx.app.emit("error", err, ctx);
    }
  });

  Api.init(app);

  app.listen(PORT, () => {
    console.log(`[Info]: server is running on port ${PORT}`);
  });
};

server();
