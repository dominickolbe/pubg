import mongoose from "mongoose";
import * as rt from "runtypes";

export const RtMatchCreate = rt.Record({
  matchId: rt.String,
  gameMode: rt.String,
  mapName: rt.String,
  duration: rt.Number,
  createdAt: rt.String,
  telemetry: rt.String,
  players: rt.Array(rt.Record({})),
  teams: rt.Array(rt.Record({})),
});

export const RtMatch = RtMatchCreate.And(
  rt.Record({
    _id: rt.InstanceOf(mongoose.Types.ObjectId),
  })
);

export const RtSingleMatchRequest = rt.Record({
  ...RtMatchCreate.fields,
  _id: rt.String,
});

export const RtMatchesRequest = rt.Array(RtSingleMatchRequest);
