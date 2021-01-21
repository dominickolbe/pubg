![Node CI](https://github.com/dominickolbe/pubg/workflows/Node%20CI/badge.svg?branch=master)

<p align="center">
  <p align="center">:baby_chick: :hatching_chick: :hatched_chick:</p>
  <h3 align="center">pubg.lol</h3>
  <p align="center">simple and clean pubg player stats and matches tracker<p>
</p>

![Preview](https://github.com/dominickolbe/pubg/blob/master/preview.png?raw=true "pubg.lol")

### Preview

[see live version here](https://pubg.lol)

The current production build is served by [vercel.com](https://vercel.com)

```http
https://pubg.lol
```

the server is running on AWS

```http
https://api.pubg.lol
```

## Getting Started

### Prerequisites

I build this entire project with the following setup:

- macOS Big Sur version 11.1
- node v14.15.4
- npm 6.14.10
- yarn v1.22.10
- Docker version 20.10.2, build 2291f61

---

### Development

1. create your `.env` file based on the `.env.example`

2. install all necessary dependencies

```bash
yarn install
```

3. start frontend

```bash
yarn start:dev:frontend
```

4. start server

```bash
yarn start:dev:server
```

---

## Production

1. create your `.env` file based on the `.env.example`

2. build docker application

```bash
docker-compose --env-file packages/pubg-server/.env build
```

3. start docker application

```bash
docker-compose --env-file packages/pubg-server/.env up
```

4. stop docker application

```bash
docker-compose --env-file packages/pubg-server/.env down
```

## Commands

import player by name

```bash
yarn workspace pubg-server ts-node --transpile-only ./src/tasks/importplayer.ts *PLAYER_NAME*
```

run update players task

```bash
NODE_ENV=production yarn workspace pubg-server ts-node --transpile-only ./src/tasks/run-update-players.ts
```

```bash
*/5 * * * * cd ~/apps/pubg/ && bash scripts/run-update-players.sh >/dev/null 2>&1
```

---

## The MIT License (MIT)

Copyright © 2021 [Dominic Kolbe](https://dominickolbe.dk) :de:
