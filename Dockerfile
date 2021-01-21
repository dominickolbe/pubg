FROM node:12

WORKDIR /usr/src/app

COPY . .

RUN yarn

CMD ["yarn", "run", "start"]