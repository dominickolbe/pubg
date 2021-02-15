import { isBefore, parseISO, sub } from "date-fns";
import Koa from "koa";
import Router from "koa-router";
import { IPlayer } from "pubg-model/types/Player";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_TOO_MANY_REQUESTS,
} from "pubg-utils/src";
import * as rt from "runtypes";
import { ON_THE_FLY_UPDATE_INTERVAL } from "../constants";
import {
  PlayerDbController,
  PlayerModel,
} from "../database/mongo/model/player";
import { getCache, setCache } from "../middleware/cache";
import {
  cache,
  duplicatedPlayerCheck,
  importNewPlayer,
  updatePlayerStatsAndMatches,
} from "../utils";

export const setUpApi = (params: { prefix: string }) => {
  const { prefix } = params;
  return {
    init: (app: Koa) => {
      const router = new Router();

      router.get("/__status", async (ctx) => {
        const uptime = Math.floor(process.uptime());
        ctx.body = {
          status: "success",
          uptime,
        };
      });

      router.get("/__headers", async (ctx) => {
        ctx.body = ctx.request.headers;
      });

      // PLAYERS

      router.get("/players/search", async (ctx) => {
        try {
          const query = rt
            .Record({
              q: rt.String,
            })
            .check(ctx.query);
          const players = await PlayerDbController.search(query.q);
          if (players.ok) {
            ctx.body = players.val;
          }
        } catch {
          ctx.response.status = HTTP_STATUS_BAD_REQUEST;
          return;
        }
      });

      router.get(
        "/players/:id",
        duplicatedPlayerCheck,
        getCache,
        async (ctx, next) => {
          const returnPlayer = (player: IPlayer) => {
            const resp = player.toObject();
            const { matches, autoUpdate, ...rest } = resp;
            ctx.body = rest;
            return next();
          };

          const updatePlayer = async (player: IPlayer) => {
            if (
              player.statsUpdatedAt === null ||
              player.matchesUpdatedAt === null ||
              isBefore(
                parseISO(player.statsUpdatedAt),
                sub(new Date(), { minutes: ON_THE_FLY_UPDATE_INTERVAL })
              ) ||
              isBefore(
                parseISO(player.matchesUpdatedAt),
                sub(new Date(), { minutes: ON_THE_FLY_UPDATE_INTERVAL })
              )
            ) {
              const result = await updatePlayerStatsAndMatches(player);
              if (result.ok) return result.val;
            }
            return player;
          };

          const player = await PlayerModel.findOne({
            name: ctx.params.id,
          });

          // return player if found
          if (player) {
            const updatedPlayer = await updatePlayer(player);
            return returnPlayer(updatedPlayer);
          }

          // try to import player
          const importedPlayer = await importNewPlayer(ctx.params.id);

          if (importedPlayer.ok) {
            const updatedPlayer = await updatePlayer(importedPlayer.val);
            return returnPlayer(updatedPlayer);
          } else if (importedPlayer.err !== HTTP_STATUS_TOO_MANY_REQUESTS) {
            // TODO check if cache is still working
            // add failed player request to cache
            cache.pubgPlayerNotFound.push(ctx.params.id);
            ctx.response.status = HTTP_STATUS_NOT_FOUND;
            return;
          } else if (importedPlayer.err === HTTP_STATUS_TOO_MANY_REQUESTS) {
            ctx.response.status = HTTP_STATUS_TOO_MANY_REQUESTS;
            return;
          }
        },
        setCache
      );

      // MATCHES

      router.get(
        "/matches/:id",
        getCache,
        async (ctx) => {
          try {
            const query = rt
              .Record({
                limit: rt.String.Or(rt.Undefined),
                offset: rt.String.Or(rt.Undefined),
              })
              .check(ctx.query);
            const limit = parseInt(query.limit || "50");
            const offset = parseInt(query.offset || "0");
            const matches = await PlayerDbController.findMatches(
              { name: ctx.params.id },
              limit,
              offset
            );
            if (matches.ok) {
              ctx.body = matches.val;
            }
          } catch {
            ctx.response.status = HTTP_STATUS_BAD_REQUEST;
            return;
          }
        },
        setCache
      );

      router.allowedMethods();
      router.prefix(prefix);

      app.use(router.routes());
    },
  };
};
