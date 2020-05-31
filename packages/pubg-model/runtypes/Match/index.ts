import mongoose from "mongoose";
import * as rt from "runtypes";

export const RtMatch = rt.Record({
  _id: rt.InstanceOf(mongoose.Types.ObjectId),
  matchId: rt.String,
  gameMode: rt.String,
  mapName: rt.String,
  duration: rt.Number,
  createdAt: rt.String,
});

export const RtMatchImport = rt.Record({
  matchId: rt.String,
  gameMode: rt.String,
  mapName: rt.String,
  duration: rt.Number,
  createdAt: rt.String,
});
