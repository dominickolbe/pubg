require("dotenv-safe").config();

import cors from "@koa/cors";
import * as Sentry from "@sentry/node";
import Koa from "koa";
import { HTTP_STATUS_INTERNAL_SERVER_ERROR } from "pubg-utils/src";
import { setUpApi } from "./api";
import { Database } from "./database";
import { DiscordNotifier } from "./utils/discord";

const PORT = process.env.PORT;

const Api = setUpApi({ prefix: "/api" });

const server = async () => {
  const result = await Database.connect();
  if (result.err) process.exit(1);

  const app = new Koa();

  app.use(cors());

  app.on("error", (err, ctx) => {
    Sentry.withScope(function (scope) {
      scope.addEventProcessor(function (event) {
        return Sentry.Handlers.parseRequest(event, ctx.request);
      });
      Sentry.captureException(err);
    });
  });

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
    DiscordNotifier(`[Info]: server started on port ${PORT}`);
  });
};

server();
