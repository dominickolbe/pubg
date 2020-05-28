import mongoose from "mongoose";
import { createNone, createSome, Option } from "option-t/cjs/PlainOption";
import { RtPlayer } from "pubg-model/runtypes/Player";
import { Player } from "pubg-model/types/Player";

mongoose.set("useCreateIndex", true);
const PlayerSchema = new mongoose.Schema({
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
    type: Date,
    default: null,
  },
  matches: {
    type: Array,
    default: [],
  },
  matchesUpdatedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const PlayerModel = mongoose.model("Player", PlayerSchema);

export const PlayerDbController = {
  findByName: async (name: string): Promise<Option<Player>> => {
    try {
      const result = await PlayerModel.findOne({ name });
      if (!result) return createNone();
      const player = RtPlayer.check(result.toObject({ versionKey: false }));
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
      const player = RtPlayer.check(
        result && result.toObject({ versionKey: false })
      );
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
            statsUpdatedAt: new Date(),
          },
        },
        { new: true }
      );
      const player = RtPlayer.check(
        result && result.toObject({ versionKey: false })
      );
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
          matchesUpdatedAt: new Date(),
        },
        $addToSet: {
          matches: matchId,
        },
      },
      { new: true }
    );
  },
};
