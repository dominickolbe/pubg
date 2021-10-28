export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_BAD_REQUEST = 400;
export const HTTP_STATUS_UNAUTHORIZED = 401;
export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_TOO_MANY_REQUESTS = 429;
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

export const GAME_MODES = [
  "solo",
  "solo-fpp",
  "duo",
  "duo-fpp",
  "squad",
  "squad-fpp",
];

export const STATS_OBJ = {
  assists: 0,
  boosts: 0,
  dBNOs: 0,
  dailyKills: 0,
  dailyWins: 0,
  damageDealt: 0,
  days: 0,
  headshotKills: 0,
  heals: 0,
  killPoints: 0,
  kills: 0,
  longestKill: 0,
  longestTimeSurvived: 0,
  losses: 0,
  maxKillStreaks: 0,
  mostSurvivalTime: 0,
  rankPoints: 0,
  rankPointsTitle: "",
  revives: 0,
  rideDistance: 0,
  roadKills: 0,
  roundMostKills: 0,
  roundsPlayed: 0,
  suicides: 0,
  swimDistance: 0,
  teamKills: 0,
  timeSurvived: 0,
  top10s: 0,
  vehicleDestroys: 0,
  walkDistance: 0,
  weaponsAcquired: 0,
  weeklyKills: 0,
  weeklyWins: 0,
  winPoints: 0,
  wins: 0,
};

export const generateNewStatsObj = () => {
  return {
    solo: { ...STATS_OBJ },
    "solo-fpp": { ...STATS_OBJ },
    duo: { ...STATS_OBJ },
    "duo-fpp": { ...STATS_OBJ },
    squad: { ...STATS_OBJ },
    squadfpp: { ...STATS_OBJ },
  };
};

export const PLAYER_MATCHES_REQUEST_DEFAULTS = {
  LIMIT: 100,
  OFFSET: 0,
};
