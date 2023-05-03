import redis, { RedisClientType } from 'redis';

let redisClient: RedisClientType | undefined;

export const initializeCache = async () => {
	if (redisClient) throw new Error('Tried to initialize the cache twice!');

	redisClient = redis.createClient({
		socket: {
			host: process.env.REDIS_HOST,
			port: Number(process.env.REDIS_PORT)
		},
		password: process.env.REDIS_PASS
	});

	await redisClient.connect();

	return redisClient;
};

/**
 * Caches a value.
 * @param key The key to cache the value under.
 * @param value The value to cache.
 * @param expiration The expiration time in seconds. Defaults to 5 minutes.
 */
export const setCache = async (
	key: string,
	value: any,
	expiration?: number
) => {
	if (!redisClient) throw new Error('Redis store not initialized');

	const MINUTE = 60;
	await redisClient.set(key, JSON.stringify(value), {
		EX: expiration ?? 5 * MINUTE
	});
};

/**
 * Gets a value from the cache.
 * @param key The key to get the value from.
 * @returns The value if it exists, otherwise null.
 */
export const getFromCache = async (key: any) => {
	if (!redisClient) throw new Error('Redis store not initialized');

	const value = await redisClient.get(key);

	return value ? JSON.parse(value) : null;
};
