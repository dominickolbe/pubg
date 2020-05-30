import dayjs from "dayjs";
import mongoose from "mongoose";
import { createNone, createSome, Option } from "option-t/cjs/PlainOption";
import { RtPlayer, RtPlayerResults } from "pubg-model/runtypes/Player";
import { Player } from "pubg-model/types/Player";

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
    matches: {
      type: Array,
      default: [],
    },
    matchesUpdatedAt: {
      type: String,
      default: null,
    },
    createdAt: {
      type: String,
      default: dayjs().format(),
    },
  },
  { versionKey: false }
);

export const PlayerModel = mongoose.model("Player", PlayerSchema);

export const PlayerDbController = {
  find: async (query: object): Promise<Option<Player[]>> => {
    try {
      const result = await PlayerModel.find(query);
      if (!result) return createNone();
      const players = RtPlayerResults.check(result);
      return createSome(players);
    } catch (error) {
      console.log(error);
      return createNone();
    }
  },
  findByName: async (name: string): Promise<Option<Player>> => {
    try {
      const result = await PlayerModel.findOne({ name });
      if (!result) return createNone();
      const player = RtPlayer.check(result.toObject());
      return createSome(player);
    } catch (error) {
      console.log(error);
      return createNone();
    }
  },
  save: async (pubgId: string, name: string): Promise<Option<Player>> => {
    try {
      const result = await new PlayerModel({
        pubgId,
        name,
        stats: null,
      }).save();
      const player = RtPlayer.check(result && result.toObject());
      return createSome(player);
    } catch (error) {
      console.log(error);
      return createNone();
    }
  },
  updateStats: async (
    id: mongoose.Types.ObjectId,
    stats: Object
  ): Promise<Option<Player>> => {
    try {
      const result = await PlayerModel.findByIdAndUpdate(
        id,
        {
          $set: {
            stats: stats,
            statsUpdatedAt: dayjs().format(),
          },
        },
        { new: true }
      );
      const player = RtPlayer.check(result && result.toObject());
      return createSome(player);
    } catch (error) {
      console.log(error);
      return createNone();
    }
  },
  addMatch: async (id: mongoose.Types.ObjectId, matchId: String) => {
    await PlayerModel.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          matchesUpdatedAt: dayjs().format(),
        },
        $addToSet: {
          matches: matchId,
        },
      },
      { new: true }
    );
  },
};
