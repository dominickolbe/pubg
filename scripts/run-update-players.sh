#!/bin/bash

echo "# # # Start importer task # # #"

sudo docker exec -t pubg-server yarn workspace pubg-server ts-node --transpile-only ./src/tasks/run-update-players.ts

echo "# # # Finished release task # # #"