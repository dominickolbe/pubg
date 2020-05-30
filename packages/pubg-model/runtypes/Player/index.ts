import * as rt from "runtypes";
import mongoose from "mongoose";

export const RtPlayer = rt.Record({
  _id: rt.InstanceOf(mongoose.Types.ObjectId),
  pubgId: rt.String,
  name: rt.String,
  createdAt: rt.InstanceOf(Date),
  stats: rt.Record({}).Or(rt.Null),
  statsUpdatedAt: rt.InstanceOf(Date).Or(rt.Null),
  // TODO
  matches: rt.Array(rt.Record({})),
  matchesUpdatedAt: rt.InstanceOf(Date).Or(rt.Null),
});

export const RtPlayerRequest = rt.Record({
  ...RtPlayer.fields,
  _id: rt.String,
  createdAt: rt.String,
  statsUpdatedAt: rt.String.Or(rt.Null),
  matchesUpdatedAt: rt.String.Or(rt.Null),
});
