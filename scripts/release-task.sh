#!/bin/bash

echo "# # # Start release task # # #"

echo "1. Stop docker instance"
sudo docker-compose --env-file packages/pubg-server/.env down

echo "2. Fetch repository ..."
git fetch origin
git reset --hard origin/master

echo "3. Rebuild docker instance"
sudo docker-compose --env-file packages/pubg-server/.env build

echo "4. Restart docker instance"
sudo docker-compose --env-file packages/pubg-server/.env up -d

echo "5. make scripts executable"
sudo chmod +x scripts/*.sh

echo "# # # Finished release task # # #"