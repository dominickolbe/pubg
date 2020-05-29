# pubg

## heroku

https://pubg-dev.herokuapp.com/

## Commands

import player

```bash
yarn workspace pubg-server ts-node --transpile-only ./src/scripts/importplayer.ts *PLAYER_NAME*
```

import player stats

```bash
yarn workspace pubg-server ts-node --transpile-only ./src/scripts/importlifetimestats.ts *PLAYER_NAME*
```

connect to heroku app

```bash
heroku run bash --app pubg-dev
```

run importer task on heroku

```bash
heroku run importplayer *PLAYER_NAME* --app pubg-dev
```

## License

Copyright (c) 2020 [Dominic Kolbe](https://dominickolbe.dk)
