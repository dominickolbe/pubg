import redis from "redis";
import { REDIS_HOST } from "../../constants";

const RedisDatabase = () => {
  const client = redis.createClient(REDIS_HOST);

  client.on("connect", () => console.log(`[Info]: connected to redis`));

  client.on("error", function (error) {
    console.error(error);
  });

  return {
    get: async (key: string) => {
      return new Promise((resolve, reject) => {
        client.get(key, (error, value) => {
          return resolve(value);
        });
      });
    },
    set: (key: string, value: string) => {
      client.set(key, value);
    },
    setWithEx: (key: string, value: string, expires: number) => {
      client.set(key, value, "EX", expires);
    },
    delete: (key: string) => {
      client.del(key);
    },
    flushdb: () => {
      console.log(`[Info]: flush redis db`);
      client.flushdb();
    },
  };
};

export const redisDatabase = RedisDatabase();
