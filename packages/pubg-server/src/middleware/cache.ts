import Koa from "koa";
import { CUSTOM_HEADER } from "../constants";
import { redisDatabase } from "../database/redis";

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

export const useCache = async (ctx: Koa.Context, next: Koa.Next) => {
  if (!ctx.cache) return next();

  const cacheValue = await redisDatabase.get(ctx.request.url);
  if (cacheValue !== null) {
    // @ts-ignore
    ctx.body = JSON.parse(cacheValue);
    return;
  }
  return next();
};
