import mongoose from "mongoose";
import { createNone, createSome, Option } from "option-t/cjs/PlainOption";
import { RtMatch } from "pubg-model/runtypes/Match";
import { IMatch, Match, MatchCreate } from "pubg-model/types/Match";

mongoose.set("useCreateIndex", true);
const MatchSchema = new mongoose.Schema(
  {
    matchId: {
      type: String,
      required: true,
      unique: true,
    },
    gameMode: {
      type: String,
      required: true,
    },
    mapName: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    teams: {
      type: Array,
      required: true,
    },
    players: {
      type: Array,
      required: true,
    },
    telemetry: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false }
);

export const MatchModel = mongoose.model<IMatch>("Match", MatchSchema);

export const MatchDbController = {
  findById: async (matchId: string): Promise<Option<Match>> => {
    try {
      const result = await MatchModel.findOne({ matchId });
      if (!result) return createNone();
      const player = RtMatch.check(result.toObject());
      return createSome(player);
    } catch (error) {
      console.log(error);
      return createNone();
    }
  },
  save: async (match: MatchCreate): Promise<Option<Match>> => {
    try {
      const result = await new MatchModel(match).save();
      const newMatch = RtMatch.check(result && result.toObject());
      return createSome(newMatch);
    } catch (error) {
      console.log(error);
      return createNone();
    }
  },
};
