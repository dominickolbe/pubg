import Koa from "koa";
import { createErr, createOk, Result } from "option-t/cjs/PlainResult";
import { IPlayer, Player } from "pubg-model/types/Player";
import { HTTP_STATUS_NOT_FOUND } from "pubg-utils/src";
import { MatchDbController } from "../database/model/match";
import { PlayerModel } from "../database/model/player";
import { MATCH_TYPES, PubgApiDriver } from "../services/PubgApiDriver";

export const importNewPlayer = async (name: string) => {
  console.log(`[Info]: start importing player "${name}" ...`);

  const request = await PubgApiDriver.player.getByName(name);

  if (!request.ok || request.val.data.length !== 1) {
    console.log(`[Error]: pubg api request failed`);
    return createErr(request.err);
  }

  const player = new PlayerModel();
  player.name = request.val.data[0].attributes.name;
  player.pubgId = request.val.data[0].id;

  const result = await player.save();

  if (!result) {
    console.log(`[Error]: import player to db failed`);
    return createErr(null);
  }

  console.log(`[Info]: player "${player.name}" successfully imported`);

  return createOk(player);
};

export const updatePlayerStatsAndMatches = async (
  player: IPlayer
): Promise<Result<IPlayer, number | null>> => {
  const request = await PubgApiDriver.player.getLifetimeStats(player.pubgId);

  if (!request.ok) {
    console.log(`[Error]: pubg api request failed`);
    return createErr(request.err);
  }

  player.stats = request.val.data.attributes.gameModeStats;
  player.statsUpdatedAt = new Date().toISOString();

  const newPlayer = await player.save();

  if (!newPlayer) {
    console.log(`[Error]: update player to db failed`);
    return createErr(null);
  }

  console.log(
    `[Info]: stats for player "${newPlayer.name}" successfully imported`
  );

  const matches: string[] = [];

  MATCH_TYPES.forEach((type) => {
    request.val.data.relationships[type].data.forEach((match) => {
      matches.push(match.id);
    });
  });

  // import matches to db
  const importedMatches = await Promise.all(
    matches.map((match) => importMatchById(match))
  );

  console.log(
    `[Info]: matches for player "${newPlayer.name}" successfully imported`
  );

  // add matches to player
  importedMatches.forEach((match) => {
    if (match.ok && !newPlayer.matches.includes(match.val._id)) {
      newPlayer.matches.push(match.val._id);
    }
  });

  newPlayer.matchesUpdatedAt = new Date().toISOString();

  await newPlayer.save();

  console.log(`[Info]: player "${newPlayer.name}" successfully updated`);

  return createOk(newPlayer);
};

export const importPlayerStats = async (
  player: IPlayer
): Promise<Result<IPlayer, number | null>> => {
  console.log(`[Info]: start importing player stats...`);

  const request = await PubgApiDriver.player.getLifetimeStats(player.pubgId);

  if (!request.ok) {
    console.log(`[Error]: pubg api request failed`);
    return createErr(request.err);
  }

  player.stats = request.val.data.attributes.gameModeStats;
  player.statsUpdatedAt = new Date().toISOString();

  const result = await player.save();

  if (!result) {
    console.log(`[Error]: update player to db failed`);
    return createErr(null);
  }

  console.log(
    `[Info]: stats for player "${player.name}" successfully imported`
  );

  return createOk(player);
};

export const importMatchById = async (id: string) => {
  const exist = await MatchDbController.findById(id);

  if (exist.ok) {
    // console.log(`[Info]: skip import. match already exist`);
    return createOk(exist.val);
  }

  const request = await PubgApiDriver.matches.getById(id);

  if (!request.ok) {
    console.log(`[Error]: pubg api request failed`);
    return createErr(request.err);
  }

  const match = await MatchDbController.save({
    matchId: request.val.data.id,
    gameMode: request.val.data.attributes.gameMode,
    mapName: request.val.data.attributes.mapName,
    duration: request.val.data.attributes.duration,
    createdAt: new Date(request.val.data.attributes.createdAt),

    // @ts-ignore
    telemetry: request.val.included.find((i) => i.type === "asset").attributes
      .URL,

    // @ts-ignore
    players: request.val.included
      .filter((i) => i.type === "participant")
      .map((i) => ({
        // @ts-ignore
        id: i.id,
        // @ts-ignore
        stats: i.attributes.stats,
      })),
    // // @ts-ignore
    teams: request.val.included
      .filter((i) => i.type === "roster")
      .map((i) => ({
        // @ts-ignore
        id: i.id,
        // @ts-ignore
        rank: i.attributes.stats.rank,
        // @ts-ignore
        teamId: i.attributes.stats.teamId,
        // @ts-ignore
        players: i.relationships.participants.data.map((n) => n.id),
      })),
  });

  if (!match.ok) {
    console.log(`[Error]: import match to db failed`);
    return createErr(null);
  }

  console.log(`[Info]: match "${match.val._id}" successfully imported`);

  return createOk(match.val);
};

export const cache: {
  pubgPlayerNotFound: string[];
} = {
  pubgPlayerNotFound: [],
};

export const duplicatedPlayerCheck = (ctx: Koa.Context, next: Koa.Next) => {
  if (cache.pubgPlayerNotFound.includes(ctx.params.id)) {
    ctx.response.status = HTTP_STATUS_NOT_FOUND;
    ctx.throw(HTTP_STATUS_NOT_FOUND);
  }
  return next();
};
