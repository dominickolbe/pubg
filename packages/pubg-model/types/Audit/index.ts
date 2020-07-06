import mongoose from "mongoose";
import * as rt from "runtypes";
import { RtAudit } from "../../runtypes/Audit";

export type Audit = rt.Static<typeof RtAudit>;

export interface IAudit extends Audit, mongoose.Document {}
