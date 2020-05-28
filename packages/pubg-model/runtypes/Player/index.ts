import * as rt from "runtypes";
import mongoose from "mongoose";

export const RtPlayer = rt.Record({
  _id: rt.InstanceOf(mongoose.Types.ObjectId),
  pubgId: rt.String,
  name: rt.String,
  createdAt: rt.InstanceOf(Date),
  stats: rt.Record({}).Or(rt.Null),
  statsUpdatedAt: rt.InstanceOf(Date).Or(rt.Null),
});
