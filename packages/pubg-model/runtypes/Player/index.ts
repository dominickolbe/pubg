import mongoose from "mongoose";
import * as rt from "runtypes";
import { RtStats } from "../Stats";

export const RtPlayer = rt.Record({
  pubgId: rt.String,
  name: rt.String,
  stats: RtStats,
  statsUpdatedAt: rt.String.Or(rt.Null),
  matches: rt.Array(rt.InstanceOf(mongoose.Types.ObjectId)),
  matchesUpdatedAt: rt.String.Or(rt.Null),
  createdAt: rt.String,
  autoUpdate: rt.Boolean,
});

export const RtPlayersSearchSingle = rt.Record({
  _id: rt.InstanceOf(mongoose.Types.ObjectId).Or(rt.String),
  pubgId: rt.String,
  name: rt.String,
});

export const RtPlayersSearch = rt.Array(RtPlayersSearchSingle);

export const RtPlayerResults = rt.Array(RtPlayer);

export const RtPlayerRequest = rt.Record({
  ...RtPlayer.fields,
  matches: rt.Optional(rt.Array(rt.InstanceOf(mongoose.Types.ObjectId))),
  autoUpdate: rt.Optional(rt.Boolean),
  _id: rt.String,
});
