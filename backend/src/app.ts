import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';

import authRouter from './routers/authenticationRouter.js';
import borrowRouter from './routers/borrowRouter.js';
import gameRouter from './routers/gameRouter.js';
import platformRouter from './routers/platformRouter.js';
import initializePassport from './passport.js';
import siteAdminRouter from './routers/siteAdminRouter.js';

config(); // Load .env file

const app = express();

await initializePassport(app);

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
	console.log('CORS open for all origins (development mode)');
	app.use(cors());
}

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/games', gameRouter);
app.use('/api/v1/platforms', platformRouter);
app.use('/api/v1/borrow', borrowRouter);
app.use('/api/v1/admin', siteAdminRouter);

app.listen(8080, () => {
	console.log('Server is running on port 8080');
});
