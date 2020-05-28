import mongoose from "mongoose";
import { createNone, createSome } from "option-t/cjs/PlainOption";

mongoose.set("useCreateIndex", true);
const MatchSchema = new mongoose.Schema({
  matchId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const MatchModel = mongoose.model("Match", MatchSchema);

export const MatchDbController = {
  findByMatchId: async (matchId: string) => {
    try {
      const result = await MatchModel.findOne({ matchId });
      if (!result) return createNone();
      return createSome(null);
    } catch (error) {
      console.log(error);
      return createNone();
    }
  },
  save: async (matchId: string) => {
    try {
      await new MatchModel({ matchId }).save();
      return createSome(null);
    } catch (error) {
      console.log(error);
      return createNone();
    }
  },
};
