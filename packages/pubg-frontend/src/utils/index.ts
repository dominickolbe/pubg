import { Stats, StatsObject } from "pubg-model/types/Stats";

export const getTotalStats = (stats: Stats) => {
  const total: StatsObject = {
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
  Object.entries(stats).forEach(([statsMode, statsModeValues]) => {
    Object.entries(statsModeValues).forEach(([key, value]) => {
      // TODO
      // @ts-ignore
      total[key] += parseInt(value);
    });
  });

  return total;
};
