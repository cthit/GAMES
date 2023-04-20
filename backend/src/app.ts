import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';

import { init } from './authentication/gamma.strategy';
import passport from 'passport';
import gameRouter from './routers/gameRouter.js';
import platformRouter from './routers/platformRouter.js';

config(); // Load .env file

const app = express();

init(passport);
app.use(passport.initialize());
app.use(passport.session());

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

app.get('/api/login', passport.authenticate('gamma'));
app.get(
	'/api/callback',
	passport.authenticate('gamma'),
	(req: express.Request, res: express.Response) => {
	/*
	Code from BookIT-Node 

 	const user: User = {
        cid: "",
        is_admin: false,
        groups: [],
        language: "en",
		...req.user,
	};
	delete user.accessToken;
	res.send(user);
	res.status(200);
	  
	*/

		res.send('OK');
		res.status(200);
	}
);
app.post('/api/logout', (req: express.Request, res: express.Response) => {
	req.logOut((err) => {
		// TODO: Better error handling
		if (err) {
			console.log(err);
			res.status(500).send('Error logging out');
			return;
		}
		res.send('OK');
		res.status(200);
	});
});

app.listen(8080, () => {
	console.log('Server is running on port 8080');
});
