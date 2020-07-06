import mongoose from "mongoose";
import * as rt from "runtypes";

export const RtMatchCreate = rt.Record({
  matchId: rt.String,
  gameMode: rt.String,
  mapName: rt.String,
  duration: rt.Number,
  createdAt: rt.InstanceOf(Date),
  telemetry: rt.String,
  players: rt.Array(
    rt.Record({
      id: rt.String,
      stats: rt.Record({
        name: rt.String,
        playerId: rt.String,
        kills: rt.Number,
        damageDealt: rt.Number,
        winPlace: rt.Number,
      }),
    })
  ),
  teams: rt.Array(
    rt.Record({
      id: rt.String,
      rank: rt.Number,
      teamId: rt.Number,
      players: rt.Array(rt.String),
    })
  ),
});

export const RtMatch = rt.Record({
  ...RtMatchCreate.fields,
  _id: rt.InstanceOf(mongoose.Types.ObjectId),
});

export const RtMatchRequest = rt.Record({
  ...RtMatchCreate.fields,
  createdAt: rt.String,
  _id: rt.String,
});

export const RtMatchesRequest = rt.Array(RtMatchRequest);
