import express, { Router } from 'express';
import passport from 'passport';

import { GammaUser } from '../models/gammaModels.js';
import { addUserToGammaConnectedOrgs } from '../services/accountService.js';

const authRouter = Router();

/**
 * @api {get} api/v1/auth/login Gamma login
 * @apiName Login
 * @apiGroup Authentication
 * @apiDescription Redirects the user to log in via Gamma
 *
 * @apiSuccess (302) redirect Redirects the user to Gamma
 *
 */
authRouter.get('/login', passport.authenticate('gamma'));

/**
 * @api {get} api/v1/auth/callback Gamma callback
 * @apiName LoginCallback
 * @apiGroup Authentication
 * @apiDescription Callback from Gamma for user login
 * @apiQuery {String} code Code from Gamma
 *
 * @apiSuccess {Object} GammaUser Information about the logged in user
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "cid": "admin",
 *     "is_admin": false,
 *     "groups": [
 *         "superadmin",
 *         "admin"
 *     ],
 *     "language": "sv",
 *     "phone": null
 * }
 */
authRouter.get(
	'/callback',
	passport.authenticate('gamma'),
	async (req: express.Request, res: express.Response) => {
		const user = req.user as GammaUser;
		delete user.accessToken;

		await addUserToGammaConnectedOrgs(user);

		res.status(200).json(user);
	}
);

/**
 * @api {post} api/v1/auth/logout Logout
 * @apiName Logout
 * @apiGroup Authentication
 * @apiDescription Logs out the current user
 *
 * @apiSuccess {json} message Message indicating success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 	"message": "Logged out"
 * }
 */
authRouter.post('/logout', (req: express.Request, res: express.Response) => {
	req.logOut((err) => {
		// TODO: Better error handling
		if (err) {
			console.error(err);

			res.status(500).json({ message: 'Error logging out' });
			return;
		}
		res.status(200).clearCookie('gamma').json({ message: 'Logged out' });
	});
});

/**
 * @api {get} api/v1/auth/user Get user
 * @apiName GetUser
 * @apiGroup Authentication
 * @apiDescription Returns information about the logged in user
 *
 * @apiSuccess {Object} GammaUser Information about the user
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "cid": "admin",
 *     "is_admin": false,
 *     "groups": [
 *         "superadmin",
 *         "admin"
 *     ],
 *     "language": "sv",
 *     "phone": null
 * }
 *
 * @apiError (401) NotLoggedIn User is not logged in
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 401 Unauthorized
 * {
 *    "message": "Not logged in"
 * }
 *
 */
authRouter.get('/user', (req: express.Request, res: express.Response) => {
	if (req.isAuthenticated()) {
		const user = req.user as GammaUser;
		delete user.accessToken;
		res.status(200).json(user);
	} else {
		res.status(401).json({ message: 'Not logged in' });
	}
});

export default authRouter;
