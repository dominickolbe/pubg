import Koa from "koa";
import { AuditModel } from "../database/model/Audit";

export const auditLog = async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    const audit = new AuditModel({
      request: {
        ip: ctx.ip || "",
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
