import Koa from "koa";
import { CUSTOM_HEADER } from "../constants";

export const useCache = (ctx: Koa.Context, next: Koa.Next) => {
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
