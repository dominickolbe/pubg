import { createErr, createOk, Result } from "option-t/cjs/PlainResult";
import { createClient } from "redis";
import { REDIS_HOST } from "../../constants";

const init = () => {
  const client = createClient({
    url: REDIS_HOST,
  });

  client.on("connect", () =>
    console.log(`[Info]: (redis) successfully connected`)
  );

  client.on("error", function (error) {
    console.error(error);
  });

  client.connect();

  return {
    get: async (key: string): Promise<Result<string, any>> => {
      try {
        const result = await client.get(key);
        return result ? createOk(result) : createErr(result);
      } catch (error) {
        return createErr(error);
      }
    },
    set: async (key: string, value: string): Promise<Result<string, any>> => {
      try {
        const result = await client.set(key, value);
        return result ? createOk(result) : createErr(result);
      } catch (error) {
        return createErr(error);
      }
    },
    setWithEx: async (
      key: string,
      value: string,
      expires: number
    ): Promise<Result<string, any>> => {
      try {
        const result = await client.set(key, value, {
          EX: expires,
        });
        return result ? createOk(result) : createErr(result);
      } catch (error) {
        return createErr(error);
      }
    },
    incr: (key: string) => {
      client.incr(key);
    },
    delete: (key: string) => {
      client.del(key);
    },
    flushdb: () => {
      console.log(`[Info]: (redis) flush db`);
      client.flushDb();
    },
    end: async () => {
      console.log(`[Info]: (redis) end connection`);
      await client.disconnect();
    },
  };
};

export const RedisCtrl = init();
