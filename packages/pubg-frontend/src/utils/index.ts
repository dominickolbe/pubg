import orderBy from "lodash/orderBy";
import { MatchRequest } from "pubg-model/types/Match";
import { Stats, StatsObject } from "pubg-model/types/Stats";
import damageCauserName from "./damageCauserName";

export const generateEmptyStats = (): StatsObject => ({
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
});

// TODO: refactor
export const generateTotalStats = (stats: Stats): StatsObject => {
  const total = generateEmptyStats();
  Object.entries(stats).forEach(([statsMode, statsModeValues]) => {
    Object.entries(statsModeValues).forEach(([key, value]) => {
      // TODO
      // @ts-ignore
      total[key] += parseInt(value);
    });
  });

  return total;
};

export const getMapName = (name: string) => {
  switch (name) {
    case "Desert_Main":
      return "Miramar";
    case "DihorOtok_Main":
      return "Vikendi";
    case "Erangel_Main":
      return "Erangel";
    case "Baltic_Main":
      return "Erangel";
    case "Range_Main":
      return "Camp Jackal";
    case "Savage_Main":
      return "Sanhok";
    case "Summerland_Main":
      return "Karakin";
    default:
      return name;
  }
};

export const getGameMode = (gameMode: string) => {
  switch (gameMode) {
    case "solo":
      return "Solo";
    case "solo-fpp":
      return "Solo (FPP)";
    case "duo":
      return "Duo";
    case "duo-fpp":
      return "Duo (FPP)";
    case "squad":
      return "Squad";
    case "squad-fpp":
      return "Squad (FPP)";
    default:
      return gameMode;
  }
};

// TODO
export const getPlayerMatchStats = (match: object, playerToFind: string) => {
  // @ts-ignore
  const test = match.players.find(
    // @ts-ignore
    // eslint-disable-next-line eqeqeq
    (player) => player.stats.playerId == playerToFind
  );

  return {
    winPlace: test.stats.winPlace,
    kills: test.stats.kills,
    damageDealt: test.stats.damageDealt,
    name: test.stats.name,
  };
};

// TODO
export const getPlayerMatchStats2 = (match: object, playerToFind: string) => {
  // @ts-ignore
  const test = match.players.find(
    // @ts-ignore
    // eslint-disable-next-line eqeqeq
    (player) => player.id == playerToFind
  );

  return {
    winPlace: test.stats.winPlace,
    kills: test.stats.kills,
    damageDealt: test.stats.damageDealt,
    name: test.stats.name,
  };
};

export const parseTelemetry = (data: object[], playerId: string) => {
  const parsedTelemetry = {
    bots: [],
    kills: [],
  };

  // console.log(data);

  try {
  } catch {}

  // TODO: count bots

  data.forEach((event) => {
    // @ts-ignore
    // console.log(event._T);
    // @ts-ignore
    if (event._T.includes("LogPlayerKill")) {
      // @ts-ignore
      if (event.victim.accountId.includes("ai.")) {
        // @ts-ignore
        if (parsedTelemetry.bots.indexOf(event.victim.accountId) === -1)
          // @ts-ignore
          parsedTelemetry.bots.push(event.victim.accountId);
      }
    }
    // @ts-ignore
    if (event._T === "LogPlayerKill") {
      if (
        // @ts-ignore
        event.killer &&
        // @ts-ignore
        event.killer.accountId === playerId &&
        // @ts-ignore
        event.victim.accountId !== playerId
      ) {
        parsedTelemetry.kills.push({
          // @ts-ignore
          victim: event.victim.name,
          // @ts-ignore
          isBot: event.victim.accountId.includes("ai."),
          // @ts-ignore
          date: event._D,
          // @ts-ignore
          how:
            // @ts-ignore
            damageCauserName[event.damageCauserName] || event.damageCauserName,
        });
      }
    }
  });

  return parsedTelemetry;
};

// ----

export const formatNumber = (number: number) =>
  new Intl.NumberFormat().format(number);

interface IPlayer {
  id: string;
  name: string;
  kills: number;
  damageDealt: number;
}
interface ITeams {
  id: string;
  rank: number;
  players: IPlayer[];
}

export const findPlayer = (match: MatchRequest, id: string) => {
  const player = match.players.find((player) => player.id === id) || null;
  return player;
};

export const generateTeamStats = (match: MatchRequest) => {
  const teams: ITeams[] = [];

  try {
    match.teams.forEach((team) => {
      teams.push({
        id: team.id,
        rank: team.rank,
        players: team.players.map((player) => {
          const p = findPlayer(match, player);
          if (!p) throw new Error();
          return {
            id: p.id,
            name: p.stats.name,
            kills: p.stats.kills,
            damageDealt: p.stats.damageDealt,
          };
        }),
      });
    });
  } catch (error) {
    throw error;
  }

  return orderBy(teams, ["rank"], ["asc"]);
};
