#!/bin/bash

echo "# # # Start release task # # #"


echo "1. Fetch repository ..."
git fetch origin
git reset --hard origin/master

echo "2. Install dependencies ..."
yarn install --frozen-lockfile

echo "3. Restart app ..."
pm2 restart pm2.json


echo "# # # Finished release task # # #"