import RedisStore from 'connect-redis';
import { Express } from 'express';
import session from 'express-session';
import passport from 'passport';
import { init } from './authentication/gamma.strategy.js';
import { initializeCache } from './services/cacheService.js';

const initializePassport = async (app: Express) => {
	init(passport);

	const redisClient = await initializeCache();

	app.use(
		session({
			secret: String(process.env.SESSION_SECRET),
			store: new RedisStore({
				client: redisClient
			}),
			resave: false,
			saveUninitialized: false
		})
	);

	app.use(passport.initialize());
	app.use(passport.session());
};

export default initializePassport;
