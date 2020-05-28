import mongoose from "mongoose";
import { createErr, createOk } from "option-t/cjs/PlainResult";
import { MONGO_CONNECTION_URI } from "../constants";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

class DbController {
  constructor() {}

  connect = async () => {
    try {
      console.log("[Info]: connect to database ...");
      const connection = await mongoose.connect(MONGO_CONNECTION_URI, options);
      console.log("[Info]: connected to database");
      return createOk(connection);
    } catch (error) {
      console.log("[Error]: connection to database failed");
      return createErr(error);
    }
  };

  disconnect = async () => mongoose.disconnect();
}
export const Database = new DbController();
