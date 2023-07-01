import { Router } from 'express';
import { z } from 'zod';
import { validateRequestBody } from 'zod-express-middleware';
import {
	InternalBorrowStatus,
	borrowGame,
	returnGame,
	listBorrows,
	listOwnGameBorrows
} from '../services/borrowService.js';
import sendApiValidationError from '../utils/sendApiValidationError.js';
import { GammaUser } from '../models/gammaModels.js';
import {
	getAccountFromCid,
	getAccountFromId
} from '../services/accountService.js';
import { isAuthenticated } from '../middleware/authenticationCheckMiddleware.js';
import { getGammaUser } from '../services/gammaService.js';
import { getGameOwnerIdFromCid } from '../services/gameOwnerService.js';

const borrowRouter = Router();

const borrowSchema = z.object({
	gameId: z.string().min(1),
	borrowStart: z.string().datetime(),
	borrowEnd: z.string().datetime()
});

/**
 * @api {post} /api/v1/borrow Borrow a game
 * @apiName BorrowGame
 * @apiGroup Borrowing
 * @apiDescription Borrows a game from the service
 *
 * @apiBody {String} gameId Id of the game
 * @apiBody {String} borrowStart Date that the game starts being borrowed
 * @apiBody {String} borrowEnd Date that the game should be returned
 *
 * @apiSuccess {String} message Message indicating success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   message: 'Game successfully borrowed'
 * }
 *
 * @apiUse ZodError
 */
borrowRouter.post(
	'/',
	isAuthenticated,
	validateRequestBody(borrowSchema),
	async (req, res) => {
		//TODO check if user is allowed to immediately borrow the game
		const gammaUser = req.user as GammaUser;

		const user = await getAccountFromCid(gammaUser.cid);
		if (!user) throw new Error(`Failed to find user with cid ${gammaUser.cid}`);

		const body = req.body;
		const status = await borrowGame(
			body.gameId,
			new Date(body.borrowStart),
			new Date(body.borrowEnd),
			user.id
		);

		if (status == InternalBorrowStatus.Borrowed)
			return sendApiValidationError(
				res,
				{
					path: 'gameId',
					message: 'The game is already borrowed'
				},
				'Body'
			);

		if (status == InternalBorrowStatus.NotValid)
			return sendApiValidationError(
				res,
				{
					path: 'gameId',
					message: 'The gameId given is not valid'
				},
				'Body'
			);

		res.status(200).json({ message: 'Game successfully borrowed' });
	}
);

const returnSchema = z.object({
	gameId: z.string().min(1),
	user: z.string().min(1)
});

/**
 * @api {post} /api/v1/borrow/return Returns a borrowed game
 * @apiName ReturnGame
 * @apiGroup Borrowing
 * @apiDescription Returns a borrowed game to be borrowed again
 *
 * @apiBody {String} gameId Id of the game to borrow
 * @apiBody {String} user User borrowing the game
 *
 * @apiSuccess {String} message Message indicating success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   message: 'Game successfully returned'
 * }
 *
 * @apiUse ZodError
 */
borrowRouter.post(
	'/return',
	validateRequestBody(returnSchema),
	async (req, res) => {
		const body = req.body;
		const status = await returnGame(body.gameId, body.user);
		if (status == InternalBorrowStatus.NotBorrowed)
			return sendApiValidationError(
				res,
				{
					path: 'gameId',
					message: "The game isn't borrowed and can therefore not be returned"
				},
				'Body'
			);
		if (status == InternalBorrowStatus.NotValid)
			return sendApiValidationError(
				res,
				{
					path: 'gameId',
					message: 'The gameId given is not valid'
				},
				'Body'
			);
		res.status(200).json({ message: 'Game successfully returned' });
	}
);

/**
 * @api {get} /api/v1/borrow/list List all booked borrows
 * @apiName ListBookedBorrows
 * @apiGroup Borrowing
 * @apiDescription Gets a list of all borrows that are currently booked
 *
 * @apiSuccess {Object[]} bookings List of bookings
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "name":"Sons of The Forest",
 *     "user":"User",
 *     "borrowStart":"2023-04-24T14:51:43.583Z",
 *     "borrowEnd":"2023-04-25T14:51:43.583Z",
 *     "returned":false
 *   }
 * ]
 *
 * @apiUse ZodError
 */
borrowRouter.get('/list', async (_, res) => {
	const borrows = await listBorrows();
	res.status(200).json(await formatBookings(borrows));
});

const formatBookings = async (bookings: any[]) => {
	return await Promise.all(
		bookings.map(async (booking) => {
			const name = (await getGammaUser(booking.user.cid)).nick;
			return {
				id: booking.id,
				gameName: booking.game.name,
				user: name,
				borrowStart: booking.borrowStart,
				borrowEnd: booking.borrowEnd,
				returned: booking.returned
			};
		})
	);
};

/**
 * @api {get} /api/v1/borrow/list/ownGames List all booked borrows on games owned by caller
 * @apiName ListOwnedBookedBorrows
 * @apiGroup Borrowing
 * @apiDescription Gets a list of all borrows that are currently booked on your games
 *
 * @apiSuccess {Object[]} bookings List of bookings
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *     "name":"Sons of The Forest",
 *     "user":"User",
 *     "borrowStart":"2023-04-24T14:51:43.583Z",
 *     "borrowEnd":"2023-04-25T14:51:43.583Z",
 *     "returned":false
 *   }
 * ]
 *
 * @apiUse ZodError
 */
borrowRouter.get('/list/ownGames', isAuthenticated, async (req, res) => {
	const gameOwnerId = await getGameOwnerIdFromCid((req.user as GammaUser).cid);
	const borrows = await listOwnGameBorrows(gameOwnerId);
	res.status(200).json(await formatBookings(borrows));
});

export default borrowRouter;
