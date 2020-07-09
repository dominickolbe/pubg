import mongoose from "mongoose";
import { createErr, createOk } from "option-t/cjs/PlainResult";
import { MONGO_CONNECTION_URI } from "../constants";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

export const Database = {
  connect: async () => {
    console.log("[Info]: connecting to database ...");
    try {
      const connection = await mongoose.connect(MONGO_CONNECTION_URI, options);
      console.log("[Info]: successfully connected to database");
      return createOk(connection);
    } catch (error) {
      console.log("[Error]: connection to database failed");
      return createErr(error);
    }
  },
  disconnect: async () => {
    console.log("[Info]: close connection to database ...");
    return mongoose.disconnect();
  },
};
