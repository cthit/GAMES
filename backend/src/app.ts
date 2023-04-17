import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';

import gameRouter from './routers/gameRouter.js';
import platformRouter from './routers/platformRouter.js';

config(); // Load .env file

const app = express();
app.use(express.json());

console.log('NODE_ENV: ', process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
	app.use(cors());
}

/**
 * @apiDefine ZodError
 * @apiError InvalidRequest Invalid request body
 * @apiErrorExample {json} Error-Response:
 *  [
 *	 {
 *	  "type": "Body",
 *	   "errors": {
 *		 "issues": [
 *		  {
 *		   "code": "invalid_type",
 *		   "expected": "string",
 *		   "received": "undefined",
 *		   "path": [
 *			"name"
 *		   ],
 *		   "message": "Required"
 *	      }
 *	   	],
 *	   	"name": "ZodError"
 *     }
 *	  }
 *  ]
 */

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
app.use('/api/v1/platforms', platformRouter);

app.listen(8080, () => {
	console.log('Server is running on port 8080');
});
