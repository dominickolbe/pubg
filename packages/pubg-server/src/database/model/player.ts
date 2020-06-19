import mongoose from "mongoose";
import { createNone, createSome, Option } from "option-t/cjs/PlainOption";
import {
  RtPlayer,
  RtPlayerResults,
  RtPlayersSearch,
} from "pubg-model/runtypes/Player";
import { IMatch, Match } from "pubg-model/types/Match";
import { IPlayer, Player, PlayersSearch } from "pubg-model/types/Player";
import { MatchModel } from "./match";

mongoose.set("useCreateIndex", true);
const PlayerSchema = new mongoose.Schema(
  {
    pubgId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    stats: {
      type: Object,
      default: null,
    },
    statsUpdatedAt: {
      type: String,
      default: null,
    },
    matches: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Match",
        default: [],
      },
    ],
    matchesUpdatedAt: {
      type: String,
      default: null,
    },
    createdAt: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

export const PlayerModel = mongoose.model<IPlayer>("Player", PlayerSchema);

export const PlayerDbController = {
  search: async (query: string): Promise<Option<PlayersSearch>> => {
    try {
      const result = await PlayerModel.find({
        name: { $regex: query, $options: "i" },
      })
        .select("_id pubgId name")
        .limit(10);
      if (!result) return createNone();
      const players = RtPlayersSearch.check(result);
      return createSome(players);
    } catch (error) {
      console.log(error);
      return createNone();
    }
  },
  findMatches: async (
    query: object,
    limit: number,
    offset: number
  ): Promise<Option<IMatch[]>> => {
    try {
      const fPlayer = await PlayerModel.findOne(query).select("matches");

      // Player not found
      if (fPlayer === null) {
        return createNone();
      }

      const matches = await MatchModel.find({
        _id: {
          $in: fPlayer.matches,
        },
      })
        .sort("-createdAt")
        .skip(offset)
        .limit(limit);

      return createSome(matches);
    } catch (error) {
      console.log(error);
      return createNone();
    }
  },
};
