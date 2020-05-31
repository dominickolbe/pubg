import * as rt from "runtypes";
import { RtStats } from "../Stats";

export const RtPubgPlayerRequest = rt.Record({
  data: rt.Array(
    rt.Record({
      type: rt.Literal("player"),
      id: rt.String,
      attributes: rt.Record({
        name: rt.String,
      }),
    })
  ),
});

const RtPubgPlayerMatchItem = rt.Record({
  data: rt.Array(
    rt.Record({
      type: rt.Literal("match"),
      id: rt.String,
    })
  ),
});

export const RtPubgPlayerStatsRequest = rt.Record({
  data: rt.Record({
    type: rt.Literal("playerSeason"),
    attributes: rt.Record({
      gameModeStats: RtStats,
    }),
    relationships: rt.Record({
      matchesSolo: RtPubgPlayerMatchItem,
      matchesSoloFPP: RtPubgPlayerMatchItem,
      matchesDuo: RtPubgPlayerMatchItem,
      matchesDuoFPP: RtPubgPlayerMatchItem,
      matchesSquad: RtPubgPlayerMatchItem,
      matchesSquadFPP: RtPubgPlayerMatchItem,
    }),
  }),
});

export const RtPubgMatchRequest = rt.Record({
  data: rt.Record({
    type: rt.Literal("match"),
    id: rt.String,
    attributes: rt.Record({
      createdAt: rt.String,
      duration: rt.Number,
      gameMode: rt.String,
      mapName: rt.String,
    }),
  }),
});
