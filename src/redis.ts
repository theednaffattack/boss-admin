import Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";

export const redisHostAndPortOpts = {
    host: process.env.NODE_ENV === "production" ? process.env.REDIS_HOST : "localhost",
    port: process.env.REDIS_PORT_NUMBER ? parseInt(process.env.REDIS_PORT_NUMBER) : 6379,
};

export const redis = new Redis({
    host: process.env.NODE_ENV === "production" ? process.env.REDIS_HOST : "localhost",
    port: process.env.REDIS_PORT_NUMBER ? parseInt(process.env.REDIS_PORT_NUMBER) : 6379,
});

export const pubsub = new RedisPubSub({
    publisher: redis,
    subscriber: redis,
});
