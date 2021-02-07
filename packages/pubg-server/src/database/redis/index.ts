import { createErr, createOk, Result } from "option-t/cjs/PlainResult";
import redis from "redis";
import { REDIS_HOST } from "../../constants";

const client = redis.createClient(REDIS_HOST);

const init = () => {
  client.on("connect", () =>
    console.log(`[Info]: (redis) successfully connected`)
  );

  client.on("error", function (error) {
    console.error(error);
  });

  return {
    get: async (key: string): Promise<Result<string, Error | null>> => {
      return new Promise((resolve) => {
        client.get(key, (error, value) => {
          if (error) return resolve(createErr(error));
          if (value == null) return resolve(createErr(null));
          return resolve(createOk(value));
        });
      });
    },
    set: async (key: string, value: string): Promise<Result<true, Error>> => {
      return new Promise((resolve) => {
        client.set(key, value, (error) => {
          if (error) return resolve(createErr(error));
          return resolve(createOk(true));
        });
      });
    },
    setWithEx: async (
      key: string,
      value: string,
      expires: number
    ): Promise<Result<true, Error>> => {
      return new Promise((resolve) => {
        client.set(key, value, "EX", expires, (error) => {
          if (error) return resolve(createErr(error));
          return resolve(createOk(true));
        });
      });
    },
    delete: (key: string) => {
      client.del(key);
    },
    flushdb: () => {
      console.log(`[Info]: (redis) flush db`);
      client.flushdb();
    },
    end: () => {
      console.log(`[Info]: (redis) end connection`);
      client.end(false);
    },
  };
};

export const RedisCtrl = init();
