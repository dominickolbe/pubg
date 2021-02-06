import Koa from "koa";
import { redisDatabase } from "../database/redis";

export const returnCache = async (ctx: Koa.Context, next: Koa.Next) => {
  if (!ctx.cache) return next();

  const cacheValue = await redisDatabase.get(ctx.request.url);
  if (cacheValue !== null) {
    // @ts-ignore
    ctx.body = JSON.parse(cacheValue);
    return;
  }
  return next();
};
