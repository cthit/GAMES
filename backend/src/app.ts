import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';

import gameRouter from './routers/gameRouter';
config(); // Load .env file

const app = express();

console.log('NODE_ENV: ', process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
	app.use(cors());
}

/**
 * @api {get} / Request Hello World
 * @apiName GetHelloWorld
 * @apiGroup Hello
 *
 * @apiSuccess {String} message Hello World
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *   {
 *    "message": "Hello World"
 *  }
 */
app.get('/', (req, res) => {
	res.status(200).json({ message: 'Hello World' });
});

app.use('/api/v1/games', gameRouter);

export default app;
