import session from "express-session";
import redis from "redis";
import RedisStore from "connect-redis"
import { Express } from "express";
import passport from 'passport';
import { init } from './authentication/gamma.strategy.js';


const initializePassport = async (app: Express) => {
init(passport);

const redisClient = redis.createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: Number(process.env.REDIS_PORT)
	},
  password: process.env.REDIS_PASS,
});

await redisClient.connect();
console.log('Redis connected');

app.use(
	session({
	  secret: String(process.env.SESSION_SECRET),
	  store: new RedisStore({
		client: redisClient 
	  }),
	  resave: false,
	  saveUninitialized: false,
	}),
  );

  console.log('Redis connected');

app.use(passport.initialize());
app.use(passport.session());
}

export default initializePassport;