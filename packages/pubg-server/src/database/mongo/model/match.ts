import mongoose from "mongoose";
import { createErr, createOk, Result } from "option-t/cjs/PlainResult";
import { RtMatch } from "pubg-model/runtypes/Match";
import { IMatch, Match, MatchCreate } from "pubg-model/types/Match";

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
  findByMatchId: async (
    matchId: string
  ): Promise<Result<Match | null, any>> => {
    try {
      const result = await MatchModel.findOne({ matchId });
      if (!result) return createOk(null);
      const match = RtMatch.check(result.toObject());
      return createOk(match);
    } catch (error) {
      console.error(error);
      return createErr(error);
    }
  },
  save: async (match: MatchCreate): Promise<Result<Match, any>> => {
    try {
      const result = await new MatchModel(match).save();
      const newMatch = RtMatch.check(result && result.toObject());
      return createOk(newMatch);
    } catch (error) {
      console.error(error);
      return createErr(error);
    }
  },
};
