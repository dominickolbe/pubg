import Koa from "koa";
import { HTTP_STATUS_OK } from "pubg-utils/src";
import { CUSTOM_HEADER } from "../constants";
import { RedisCtrl } from "../database/redis";

export const checkCacheHeader = (ctx: Koa.Context, next: Koa.Next) => {
  const value = ctx.request.headers[CUSTOM_HEADER.CACHE_CONTROL];
  switch (value) {
    case "no-cache":
      ctx.cache = false;
      break;
    default:
      ctx.cache = true;
      break;
  }
  return next();
};

export const getCache = async (ctx: Koa.Context, next: Koa.Next) => {
  if (!ctx.cache) return next();
  const response = await RedisCtrl.get(ctx.request.url);
  if (response.ok) {
    ctx.body = JSON.parse(response.val);
    return;
  }
  return next();
};

export const setCache = async (ctx: Koa.Context, next: Koa.Next) => {
  if (!ctx.cache) return next();
  if (ctx.response.status === HTTP_STATUS_OK) {
    RedisCtrl.set(ctx.request.url, JSON.stringify(ctx.body));
  }
  return next();
};
