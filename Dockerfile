FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json package.json
COPY packages/pubg-frontend/package.json packages/pubg-frontend/package.json
COPY packages/pubg-model/package.json packages/pubg-model/package.json
COPY packages/pubg-server/package.json packages/pubg-server/package.json
COPY packages/pubg-utils/package.json packages/pubg-utils/package.json

COPY yarn.lock yarn.lock

RUN yarn install --frozen-lockfile

COPY packages packages

CMD ["yarn", "start"]