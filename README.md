![GitHub package.json version](https://img.shields.io/github/package-json/v/dominickolbe/pubg?color=%23688eff&style=flat-square)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/dominickolbe/pubg?color=%23688eff&style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/dominickolbe/pubg/Tests?color=%237DD420&label=tests&style=flat-square)

<p align="center">
  <p align="center">:baby_chick: :hatching_chick: :hatched_chick:</p>
  <h3 align="center">pubg.lol</h3>
  <p align="center">simple and clean pubg player stats and matches tracker<p>
</p>

![Preview](https://github.com/dominickolbe/pubg/blob/master/preview.png?raw=true "pubg.lol")

## Preview

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

I build this project with the following setup:

- macOS Monterey v12.0 Beta
- node v16.7.0
- yarn v1.22.11
- npm v7.20.3
- Docker version 20.10.8, build 3967b7d

---

## Development

1. create your `.env` file based on the `.env.example`

2. install all necessary dependencies

```bash
yarn install
```

3. start frontend

```bash
yarn frontend:start
```

4. start server

```bash
yarn server:start:dev
```

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

---

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

## LICENSE

Copyright © 2021 [Dominic Kolbe](https://dominickolbe.dk) :de:
