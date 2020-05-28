require("dotenv-safe").config();

import { Database } from "../database";
import { MatchDbController } from "../database/model/match";
import { PlayerDbController } from "../database/model/player";
import { PubgApiDriver } from "../services/PubgApiDriver";

(async () => {
  const playerNameArg = process.argv[2] ?? null;

  if (!playerNameArg) {
    console.log(`[Error]: player arg missing`);
    process.exit(1);
  }

  console.log(
    `[Info]: start importing player lifetime stats: ${playerNameArg}`
  );

  const db = await Database.connect();
  if (db.err) process.exit(1);

  const player = await PlayerDbController.findByName(playerNameArg);

  if (!player.ok) {
    console.log(`[Error]: player doesn't exists in database`);
    await Database.disconnect();
    process.exit(1);
  }

  const request = await PubgApiDriver.player.getLifetimeStats(
    player.val.pubgId
  );

  if (request.ok) {
    await PlayerDbController.updateStats(
      player.val._id,
      request.val.data.attributes.gameModeStats
    );

    console.log(`[Info]: player stats successfully imported`);

    console.log(`[Info]: import player matches...`);

    // TODO: IMPORT MATCH

    // TODO: "request.val.data.relationships" contains other keys
    const matchTypes = [
      "matchesSolo",
      "matchesSoloFPP",
      "matchesDuo",
      "matchesDuoFPP",
      "matchesSquad",
      "matchesSquadFPP",
    ] as const;

    for (const matchType of matchTypes) {
      for (const match of request.val.data.relationships[matchType].data) {
        // add match to player
        await PlayerDbController.addMatch(player.val._id, match.id);

        // import match to matches table if doesn't exist
        const exists = await MatchDbController.findByMatchId(match.id);
        if (!exists.ok) {
          console.log(`[Info]: new match found "${match.id}"`);
          console.log(`[Info]: request match data for "${match.id}"`);

          // get data from api
          await PubgApiDriver.matches.getById(match.id);

          // store match
          await MatchDbController.save(match.id);

          console.log(`[Info]: added match data to db "${match.id}"`);
        }
      }
    }

    console.log(`[Info]: player matches imported`);
  }

  await Database.disconnect();
  process.exit(0);
})();
