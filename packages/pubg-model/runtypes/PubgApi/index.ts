import * as rt from "runtypes";

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

export const RtPubgPlayerStatsKeysRequest = rt.Record({
  assists: rt.Number,
  boosts: rt.Number,
  dBNOs: rt.Number,
  dailyKills: rt.Number,
  dailyWins: rt.Number,
  damageDealt: rt.Number,
  days: rt.Number,
  headshotKills: rt.Number,
  heals: rt.Number,
  killPoints: rt.Number,
  kills: rt.Number,
  longestKill: rt.Number,
  longestTimeSurvived: rt.Number,
  losses: rt.Number,
  maxKillStreaks: rt.Number,
  mostSurvivalTime: rt.Number,
  rankPoints: rt.Number,
  rankPointsTitle: rt.String,
  revives: rt.Number,
  rideDistance: rt.Number,
  roadKills: rt.Number,
  roundMostKills: rt.Number,
  roundsPlayed: rt.Number,
  suicides: rt.Number,
  swimDistance: rt.Number,
  teamKills: rt.Number,
  timeSurvived: rt.Number,
  top10s: rt.Number,
  vehicleDestroys: rt.Number,
  walkDistance: rt.Number,
  weaponsAcquired: rt.Number,
  weeklyKills: rt.Number,
  weeklyWins: rt.Number,
  winPoints: rt.Number,
  wins: rt.Number,
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
      gameModeStats: rt.Record({
        solo: RtPubgPlayerStatsKeysRequest,
        "solo-fpp": RtPubgPlayerStatsKeysRequest,
        duo: RtPubgPlayerStatsKeysRequest,
        "duo-fpp": RtPubgPlayerStatsKeysRequest,
        squad: RtPubgPlayerStatsKeysRequest,
        "squad-fpp": RtPubgPlayerStatsKeysRequest,
      }),
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
