require("dotenv-safe").config();

import Agenda from "Agenda";
import { MONGO_CONNECTION_URI } from "../constants";
import { Database } from "../database/mongo";
import { sleep } from "../utils";

const PLAYERS_TO_IMPORT = ["donkolbe", "markusmueller", "Fisser89"];

const agenda = new Agenda({
  db: {
    address: MONGO_CONNECTION_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: false,
    },
    collection: "jobs",
  },
});

agenda.define("wqefwfwf players", { concurrency: 1 }, async (job, done) => {
  const { player } = job.attrs.data;
  console.log(`start job | "${player}"`);

  await sleep(5000);

  if (player === "Fisser89") {
    job.fail(new Error("Fisser89 failed"));
    await job.save();
  }

  console.log(`finished job | "${player}"`);
  return done();
  // await job.remove();
});

const run = async () => {
  const db = await Database.connect();
  if (db.err) {
    await Database.disconnect();
    process.exit(0);
  }

  agenda.start();

  async function graceful() {
    await agenda.stop();
    process.exit(0);
  }

  process.on("SIGTERM", graceful);
  process.on("SIGINT", graceful);

  agenda.on("complete", (job) => {
    const { player } = job.attrs.data;
    console.log(`Job for ${player} finished`);
  });

  for (const player of PLAYERS_TO_IMPORT) {
    const job = agenda.create("iwqewqfwqfwer", {
      player,
    });
    await job.save();
  }
};

run();
