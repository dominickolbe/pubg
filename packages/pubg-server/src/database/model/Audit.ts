import mongoose from "mongoose";
import { IAudit } from "pubg-model/types/Audit";

mongoose.set("useCreateIndex", true);
const AuditSchema = new mongoose.Schema(
  {
    request: {
      ip: {
        type: String,
      },
      method: {
        type: String,
      },
      path: {
        type: String,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expireAt: {
      type: Date,
      default: Date.now,
      index: { expires: "1d" },
    },
  },
  { versionKey: false }
);

export const AuditModel = mongoose.model<IAudit>("Audit", AuditSchema);
