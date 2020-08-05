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

the server is running on [heroku.com](https://heroku.com)

```http
https://api.pubg.lol
```

## Production

install all necessary dependencies (node_modules)

```bash
yarn install
```

build frontend application

```bash
yarn build:frontend
```

## Tests (coming soon)

make sure the build process of app is working

```bash
yarn build:frontend
```

## Commands

import player by name

```bash
yarn workspace pubg-server ts-node --transpile-only ./src/tasks/importplayer.ts *PLAYER_NAME*
```

update players and matches

```bash
yarn workspace pubg-server ts-node --transpile-only ./src/tasks/updateplayers.ts *UPDATE_INTERVAL optional*
```

## heroku tasks

```bash
heroku run importplayer *PLAYER_NAME* --app pubg-lol
```

```bash
heroku run updateplayers --app pubg-lol
```

## License

Copyright (c) 2020 [Dominic Kolbe](https://dominickolbe.dk)
