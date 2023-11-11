import {createClient} from "redis";

const MAX_RETRIES = 2;

(async () => {
  try {
    const client = await createClient({
      url : "redis://:eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81@localhost:6379",
      socket: {
        reconnectStrategy: (times) => {
          if (times >= MAX_RETRIES) {
            return new Error(`Reached max retries (${MAX_RETRIES}) while attempting to connect`);
          }
          return times;
        },
      },
    });
    await client.connect();
    const result = await client.get("Foo");
    console.log(`result: ${result}`);
    process.exit(0);
  } catch (err) {
    console.log(err);
  }
})();