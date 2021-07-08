import { isAfter, parseISO, sub } from "date-fns";
import orderBy from "lodash/orderBy";
import { MatchesRequest, MatchRequest } from "pubg-model/types/Match";
import { Stats, StatsObject } from "pubg-model/types/Stats";
import { ITelemtryPlayer, Telemtry } from "pubg-model/types/Telemtry";
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
    case "Chimera_Main":
      return "Paramo";
    case "Range_Main":
      return "Camp Jackal";
    case "Savage_Main":
      return "Sanhok";
    case "Summerland_Main":
      return "Karakin";
    case "Tiger_Main":
      return "Taego";
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

export const findPlayerById = (match: MatchRequest, id: string) =>
  match.players.find((player) => player.id === id) || null;

export const findPlayerByPubgId = (match: MatchRequest, playerId: string) =>
  match.players.find((player) => player.stats.playerId === playerId) || null;

export const generateTeamStats = (match: MatchRequest) => {
  const teams: ITeams[] = [];

  try {
    match.teams.forEach((team) => {
      teams.push({
        id: team.id,
        rank: team.rank,
        players: team.players.map((player) => {
          const p = findPlayerById(match, player);
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

export const parseMatchTelemetryByPlayer = (
  telemtry: Telemtry,
  playerId: string
) => {
  const data: ITelemtryPlayer = {
    kills: [],
    totalBots: 0,
  };

  telemtry.forEach((event) => {
    // This is a workaround to fix the typescript issue
    // with different event types
    if ("_T" in event) {
      switch (event._T) {
        case "LogPlayerKill":
          // Player killed by bluezone
          // damageTypeCategory ="Damage_BlueZone"
          if (event.killer === null) return;
          if (event.killer.accountId !== playerId) return;
          data.kills.push({
            victim: {
              name: event.victim.name,
              isBot: !!event.victim.accountId.includes("ai."),
            },
            damageTypeCategory: event.damageTypeCategory,
            damageCauserName:
              // @ts-ignore
              damageCauserName[event.damageCauserName] ||
              event.damageCauserName,
            timestamp: event._D,
          });
          break;
        case "LogMatchEnd":
          data.totalBots = event.characters.filter((player) =>
            player.character.accountId.includes("ai.")
          ).length;
      }
    }
  });
  return data;
};

export const getRecentlyPlayedWith = (
  matches: MatchesRequest,
  playerId: string,
  limit: number
) => {
  const teamPlayer: { name: string; matches: number }[] = [];

  matches
    .filter((match) =>
      // TODO: create constant
      isAfter(parseISO(match.createdAt), sub(new Date(), { days: 14 }))
    )
    .forEach((match) => {
      const player = findPlayerByPubgId(match, playerId);
      if (!player) throw new Error();

      const team = match.teams.find((team) => team.players.includes(player.id));
      if (!team) throw new Error();

      team.players.forEach((p) => {
        if (p === player.id) return; // skip same player
        const t = findPlayerById(match, p);
        if (!t) throw new Error();
        const fIndex = teamPlayer.findIndex((i) => i.name === t.stats.name);
        if (fIndex !== -1) {
          teamPlayer[fIndex].matches += 1;
        } else {
          teamPlayer.push({
            name: t.stats.name,
            matches: 1,
          });
        }
      });
    });

  return orderBy(teamPlayer, ["matches"], ["desc"]).slice(0, limit);
};
