import Koa from "koa";
import { createErr, createOk, Result } from "option-t/cjs/PlainResult";
import { Player } from "pubg-model/types/Player";
import { HTTP_STATUS_NOT_FOUND } from "pubg-utils/src";
import { MatchDbController } from "../database/model/match";
import { PlayerDbController } from "../database/model/player";
import { PubgApiDriver } from "../services/PubgApiDriver";

export const importPlayerByName = async (name: string) => {
  console.log(`[Info]: start importing player "${name}" ...`);

  const request = await PubgApiDriver.player.getByName(name);

  if (!request.ok || request.val.data.length !== 1) {
    console.log(`[Error]: pubg api request failed`);
    return createErr(request.err);
  }

  const player = await PlayerDbController.save(
    request.val.data[0].id,
    request.val.data[0].attributes.name
  );

  if (!player.ok) {
    console.log(`[Error]: import player to db failed`);
    return createErr(null);
  }

  console.log(`[Info]: player "${player.val.name}" successfully imported`);

  return createOk(player.val);
};

export const importPlayerStats = async (
  player: Player
): Promise<Result<Player, number | null>> => {
  console.log(`[Info]: start importing player stats...`);

  const request = await PubgApiDriver.player.getLifetimeStats(player.pubgId);

  if (!request.ok) {
    console.log(`[Error]: pubg api request failed`);
    return createErr(request.err);
  }

  const newPlayer = await PlayerDbController.updateStats(
    player._id,
    request.val.data.attributes.gameModeStats
  );

  if (!newPlayer.ok) {
    console.log(`[Error]: update player to db failed`);
    return createErr(null);
  }

  console.log(
    `[Info]: stats for player "${newPlayer.val.name}" successfully imported`
  );

  return createOk(newPlayer.val);
};

export const importMatchById = async (id: string) => {
  const exist = await MatchDbController.findById(id);

  if (exist.ok) {
    console.log(`[Info]: skip import. match already exist`);
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
    createdAt: request.val.data.attributes.createdAt,
  });

  if (!match.ok) {
    console.log(`[Error]: import match to db failed`);
    return createErr(null);
  }

  console.log(`[Info]: match "${match.val._id}" successfully imported`);

  return createOk(match.val);
};

export const importMatches = async (pubgId: string) => {
  const request = await PubgApiDriver.player.getLifetimeStats(pubgId);

  if (!request.ok) {
    console.log(`[Error]: pubg api request failed`);
    return createErr(request.err);
  }

  // TODO
  const matchTypes = [
    "matchesSolo",
    "matchesSoloFPP",
    "matchesDuo",
    "matchesDuoFPP",
    "matchesSquad",
    "matchesSquadFPP",
  ] as const;

  for (const matchType of matchTypes) {
    for (const match of request.val.data.relationships[matchType].data) {
      await importMatchById(match.id);
    }
  }
  return createOk(null);
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
