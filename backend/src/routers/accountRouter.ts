import express, { Router } from 'express';

import { GammaUser } from '../models/gammaModels.js';
import { getAccountFromId } from '../services/accountService.js';
import { getFromCache, setCache } from '../services/cacheService.js';
import { getGammaUser } from '../services/gammaService.js';

const accountRouter = Router();

/**
 * @api {get} /api/v1/account/:id/nick Get nick from id
 * @apiParam {String} id User id
 * @apiName GetNick
 * @apiGroup Account
 * @apiDescription Get the nick of a user from their id
 *
 * @apiError (404) AccountNotFound Account not found
 *
 * @apiSuccess {String} userId The id of the user
 * @apiSuccess {String} nick The nick of the user
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *
 *  {
 *      "userId": "clgzcxo5o0002lpr0sz7d5t5k",
 *      "nick": "Pancake"
 *  }
 *
 * @apiUse ZodError
 *
 */
accountRouter.get(
	'/:id/nick',
	async (req: express.Request, res: express.Response) => {
		const nick = await getFromCache('nick-from-id-' + req.params.id);
		if (nick)
			return res.status(200).json({ usedId: req.params.id, nick: nick });

		const account = await getAccountFromId(req.params.id);
		if (!account) return res.status(404).send('Account not found');

		let gammaUser: GammaUser;
		try {
			gammaUser = await getGammaUser(account.cid);
		} catch (e) {
			return res.status(500).send('Error getting user from Gamma');
		}

		const HOUR = 3600;
		setCache('nick-from-id-' + req.params.id, gammaUser.nick, HOUR);

		res.status(200).json({ usedId: req.params.id, nick: gammaUser.nick });
	}
);

export default accountRouter;
