import * as rt from "runtypes";
import { RtStats } from "../Stats";

const RtPubgPlayerMatchItem = rt.Record({
  data: rt.Array(
    rt.Record({
      type: rt.Literal("match"),
      id: rt.String,
    })
  ),
});

export const RtPubgPlayerRequest = rt.Record({
  data: rt.Record({
    type: rt.Literal("player"),
    id: rt.String,
    attributes: rt.Record({
      name: rt.String,
    }),
    relationships: rt.Record({
      matches: RtPubgPlayerMatchItem,
    }),
  }),
});

export const RtPubgPlayersRequest = rt.Record({
  data: rt.Array(
    rt.Record({
      type: rt.Literal("player"),
      id: rt.String,
      attributes: rt.Record({
        name: rt.String,
      }),
      relationships: rt.Record({
        matches: RtPubgPlayerMatchItem,
      }),
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

export const RtPubgMatchRoster = rt.Record({
  type: rt.Literal("roster"),
  id: rt.String,
  relationships: rt.Record({
    participants: rt.Record({
      data: rt.Array(
        rt.Record({
          id: rt.String,
        })
      ),
    }),
  }),
});

export const RtPubgMatchParticipant = rt.Record({
  type: rt.Literal("participant"),
  id: rt.String,
  attributes: rt.Record({
    stats: rt.Record({
      // TODO add all keys
    }),
  }),
});

export const RtPubgMatchAsset = rt.Record({
  type: rt.Literal("asset"),
  id: rt.String,
  attributes: rt.Record({
    URL: rt.String,
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
  included: rt.Array(
    rt
      .Record({ type: rt.String })
      .Or(RtPubgMatchRoster)
      .Or(RtPubgMatchParticipant)
      .Or(RtPubgMatchAsset)
  ),
});
