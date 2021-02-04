import Koa from "koa";
import { HTTP_STATUS_UNAUTHORIZED } from "pubg-utils/src";
import { AUTH_API_KEY } from "../constants";

export const hasAuthHeader = async (ctx: Koa.Context, next: Koa.Next) => {
  const value = ctx.request.headers["x-api-key"];

  if (value !== AUTH_API_KEY) {
    ctx.response.status = HTTP_STATUS_UNAUTHORIZED;
    return;
  }

  return next();
};
