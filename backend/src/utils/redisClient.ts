import { createClient } from "redis";

const protocol = process.env.REDIS_TLS_ENABLED === "true" ? "rediss" : "redis";
const redisUrl = `${protocol}://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

const redisClient = createClient({
  url: redisUrl,
  password: process.env.REDIS_PASSWORD,
  socket:
    process.env.REDIS_TLS_ENABLED === "true"
      ? {
          tls: true,
          rejectUnauthorized: false,
        }
      : undefined,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis connection established"));

(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Redis connection failed:", err);
    process.exit(1);
  }
})();

// Token blacklist functions
export const addToBlacklist = async (token: string, expiresIn = 604800) => {
  try {
    await redisClient.set(`bl_${token}`, "1", { EX: expiresIn });
  } catch (err) {
    console.error("Failed to blacklist token:", err);
  }
};

export const isBlacklisted = async (token: string) => {
  try {
    const result = await redisClient.exists(`bl_${token}`);
    return result === 1;
  } catch (err) {
    console.error("Failed to check token blacklist:", err);
    return false;
  }
};

export default redisClient;
