import mongoose from "mongoose";
import * as rt from "runtypes";
import { RtStats } from "../Stats";

export const RtDbPlayer = rt.Record({
  pubgId: rt.String,
  name: rt.String,
  stats: RtStats.Or(rt.Null),
  statsUpdatedAt: rt.String.Or(rt.Null),
  matches: rt.Array(rt.Record({})),
  matchesUpdatedAt: rt.String.Or(rt.Null),
  createdAt: rt.String,
});

export const RtPlayer = rt.Record({
  _id: rt.InstanceOf(mongoose.Types.ObjectId),
  pubgId: rt.String,
  name: rt.String,
  createdAt: rt.String,
  stats: RtStats.Or(rt.Null),
  statsUpdatedAt: rt.String.Or(rt.Null),
  // TODO
  matches: rt.Array(rt.Record({})),
  matchesUpdatedAt: rt.String.Or(rt.Null),
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
  _id: rt.String,
  matches: rt.Array(rt.String),
});
