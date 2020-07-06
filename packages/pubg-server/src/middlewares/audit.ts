import Koa from "koa";
import { AuditModel } from "../database/model/Audit";

export const auditLog = async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    const getClientIP = () => {
      if (ctx.request.headers["x-forwarded-for"]) {
        return ctx.request.headers["x-forwarded-for"]
          .split(",")
          .reverse()[0]
          .trim();
      }
      return ctx.request.ip || "";
    };
    const audit = new AuditModel({
      request: {
        ip: getClientIP(),
        method: ctx.request.method,
        path: ctx.request.url,
      },
    });
    audit.save();
  } catch (error) {
    console.log(`[Error]: audit failed`);
    console.log(error);
  }
  return next();
};
