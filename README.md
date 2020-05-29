# pubg

> source of pubg

## Preview

vercel.com

```
https://pubg-dev.now.sh
```

heroku

```
https://pubg-app.herokuapp.com
```

## Production

build application

```
$ yarn build:frontend
```

## Commands

import player

```bash
yarn workspace pubg-server ts-node --transpile-only ./src/scripts/importplayer.ts *PLAYER_NAME*
```

import player stats

```bash
yarn workspace pubg-server ts-node --transpile-only ./src/scripts/importlifetimestats.ts *PLAYER_NAME*
```

run importer task on heroku

```bash
heroku run importplayer *PLAYER_NAME* --app pubg-dev
```

## License

Copyright (c) 2020 [Dominic Kolbe](https://dominickolbe.dk)
