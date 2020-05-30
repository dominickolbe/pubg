# pubg

> source of pubg

## Preview

vercel.com

```
https://pubg-app.now.sh
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

update players

```bash
yarn workspace pubg-server ts-node --transpile-only ./src/tasks/updateplayers.ts
```

run importer task on heroku

```bash
heroku run importplayer *PLAYER_NAME* --app pubg-app
```

run update task on heroku

```bash
heroku run updateplayers --app pubg-app
```

## License

Copyright (c) 2020 [Dominic Kolbe](https://dominickolbe.dk)
