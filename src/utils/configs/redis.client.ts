import { createClient } from "@redis/client";
import redisConfig from "../configs/redis.config";
import IORedis from 'ioredis';

const redisClient = createClient({
  url: `${process.env.REDIS_URL}`,
});

redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.on("connect", () => console.log("Redis connected!"));

export const connectRedis = async () => {
  await redisClient.connect();
};

export default redisClient;