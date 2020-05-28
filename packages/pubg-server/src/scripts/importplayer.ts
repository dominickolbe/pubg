require("dotenv-safe").config();

import { Database } from "../database";
import { PlayerDbController } from "../database/model/player";
import { PubgApiDriver } from "../services/PubgApiDriver";

const importplayer = async () => {
  const playerNameArg = process.argv[2] ?? null;

  if (!playerNameArg) {
    console.log(`[Error]: player arg missing`);
    process.exit(1);
  }

  const db = await Database.connect();
  if (db.err) process.exit(1);

  console.log(`[Info]: start importing player: ${playerNameArg}`);

  const result = await PlayerDbController.findByName(playerNameArg);

  if (result.ok) {
    console.log(`[Info]: player already exists`);
    await Database.disconnect();
    process.exit(0);
  }

  const pubgPlayer = await PubgApiDriver.player.getByName(playerNameArg);

  if (pubgPlayer.ok && pubgPlayer.val.data.length === 1) {
    const newPlayer = await PlayerDbController.save(
      pubgPlayer.val.data[0].id,
      pubgPlayer.val.data[0].attributes.name
    );

    if (newPlayer.ok) {
      console.log(`[Info]: player successfully imported`);
    } else {
      console.log(`[Error]: insert to database failed`);
      await Database.disconnect();
      process.exit(1);
    }
  }

  await Database.disconnect();
  process.exit(0);
};

importplayer();
