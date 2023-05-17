import { Router } from 'express';
import { z } from 'zod';
import { validateRequestBody } from 'zod-express-middleware';
import {
	BorrowState,
	createBorrowRequest,
	respondBorrowRequest,
	getActiveBorrowRequests
} from '../services/borrowRequestService.js';
import sendApiValidationError from '../utils/sendApiValidationError.js';
import { GammaUser } from '../models/gammaModels.js';
import { getGameOwnerIdFromCid } from '../services/gameOwnerService.js';
import { getAccountFromCid } from '../services/accountService.js';
import { getAccountFromId } from '../services/accountService.js';
import { isAuthenticated } from '../middleware/authenticationCheckMiddleware.js';

const borrowRequestRouter = Router();

const borrowRequestSchema = z.object({
	gameId: z.string().min(1),
	borrowStart: z.string().datetime(),
	borrowEnd: z.string().datetime()
});

/**
 * @api {post} /api/v1/borrow/request Request to borrow a game
 * @apiName RequestBorrowGame
 * @apiGroup Requesting
 * @apiDescription Requests to borrow a game from the service
 *
 * @apiBody {String} gameId Id of the game
 * @apiBody {String} borrowStart Date that the game starts being borrowed
 * @apiBody {String} borrowEnd Date that the game is expected to be returned
 *
 * @apiSuccess {String} message Message indicating success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   message: 'Borrow was successfully requested'
 * }
 *
 * @apiUse ZodError
 */
borrowRequestRouter.post(
	'/',
	isAuthenticated,
	validateRequestBody(borrowRequestSchema),
	async (req, res) => {
		const user = req.user as GammaUser;
		const body = req.body;
		const status = await createBorrowRequest(
			body.gameId,
			user.cid,
			new Date(body.borrowStart),
			new Date(body.borrowEnd)
		);
		if (status == BorrowState.InPast)
			return sendApiValidationError(
				res,
				{
					path: 'gameId',
					message: 'A game cannot be borrowed in the past'
				},
				'Body'
			);
		if (status == BorrowState.Inverted)
			return sendApiValidationError(
				res,
				{
					path: 'gameId',
					message: 'A game cannot be returned before it is borrowed'
				},
				'Body'
			);
		if (status == BorrowState.Overlapping)
			return sendApiValidationError(
				res,
				{
					path: 'gameId',
					message: 'The game is already borrowed during this period'
				},
				'Body'
			);
		if (status == BorrowState.NotValid)
			return sendApiValidationError(
				res,
				{
					path: 'gameId',
					message: 'The gameId given is not valid'
				},
				'Body'
			);
		res.status(200).json({ message: 'Borrow was successfully requested' });
	}
);

const borrowRequestResponseSchema = z.object({
	gameId: z.string().min(1),
	approved: z.boolean(),
	startDate: z.string().datetime(),
	endDate: z.string().datetime()
});

/**
 * @api {post} /api/v1/borrow/request/respond Respond to a borrow request
 * @apiName RespondBorrowRequest
 * @apiGroup Requesting
 * @apiDescription Accepts or rejects a borrow request
 *
 * @apiBody {String} gameId Id of the game to borrow
 * @apiBody {String} startDate Date that the game starts being borrowed
 * @apiBody {String} endDate Date that the game is expected to be returned
 * @apiBody {Boolean} approved Whether the request is accepted or rejected
 *
 * @apiSuccess {String} message Message indicating success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   message: 'Request accepted successfully'
 * }
 *
 * @apiUse ZodError
 */
borrowRequestRouter.post(
	'/respond',
	validateRequestBody(borrowRequestResponseSchema),
	async (req, res) => {
		const body = req.body;
		const status = await respondBorrowRequest(
			body.gameId,
			new Date(body.startDate),
			new Date(body.endDate),
			body.approved
		);
		if (status == BorrowState.NotValid)
			return sendApiValidationError(
				res,
				{
					path: 'gameId',
					message: 'The gameId given is not valid'
				},
				'Body'
			);
		let requestResponse = `Request ${body.approved ? 'accepted' : 'rejected'
			} successfully`;
		res.status(200).json({ message: requestResponse });
	}
);

/**
 * @api {post} /api/v1/borrow/request/list Get a list of pending borrow requests
 * @apiName ListPendingBorrowRequests
 * @apiGroup Requesting
 * @apiDescription Gets a list of pending borrow requests for the user
 *
 * @apiSuccess {String} message Message indicating success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "gameId":"clguralhj00009btg94vqquv4",
 *     "user":"User",
 *     "borrowStart":"2023-03-27T00:00:00.000Z",
 *     "borrowEnd":"2023-03-28T00:00:00.000Z",
 *     "name":"The Forest"
 *   }
 * ]
 *
 * @apiUse ZodError
 */
borrowRequestRouter.get(
	'/list',
 isAuthenticated,
	async (req, res) => {
  const user = await getAccountFromCid((req.user as GammaUser).cid);
  if(!user) return;
		const requests = await getActiveBorrowRequests();
		res.status(200).json(await formatBorrowRequests(requests));
	}
);


const formatBorrowRequests = async (requests: any[]) => {
	return await Promise.all(
		requests.map(async (request) => {
			const user = (await getAccountFromId(request.userId))?.cid;
			return {
				gameId: request.gameId,
				user,
				borrowStart: request.borrowStart,
				borrowEnd: request.borrowEnd,
				approved: request.approved,
				name: request.game.name
			};
		})
	);
};

export default borrowRequestRouter;
