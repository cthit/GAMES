import { Router } from 'express';
import { z } from 'zod';
import { validateRequestBody } from 'zod-express-middleware';
import {
	BorrowStatus,
	borrowGame,
	returnGame,
	listBorrows
} from '../services/borrowService.js';
import sendApiValidationError from '../utils/sendApiValidationError.js';
import { GammaUser } from '../models/gammaModels.js';
import { getAccountFromCid } from '../services/accountService.js';

const borrowRouter = Router();

const borrowSchema = z.object({
	gameId: z.string().min(1),
	user: z.string().min(1),
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
 * @apiBody {String} user User that borrows the game
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
borrowRouter.post('/', validateRequestBody(borrowSchema), async (req, res) => {
	if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
	const gammaUser = req.user as GammaUser;

	const user = await getAccountFromCid(gammaUser.cid);
	if (!user) return res.status(401).json({ message: 'Unauthorized' });

	const body = req.body;
	const status = await borrowGame(
		body.gameId,
		new Date(body.borrowStart),
		new Date(body.borrowEnd),
		user.id
	);

	if (status == BorrowStatus.Borrowed)
		return sendApiValidationError(
			res,
			{
				path: 'gameId',
				message: 'The game is already borrowed'
			},
			'Body'
		);

	if (status == BorrowStatus.NotValid)
		return sendApiValidationError(
			res,
			{
				path: 'gameId',
				message: 'The gameId given is not valid'
			},
			'Body'
		);

	res.status(200).json({ message: 'Game successfully borrowed' });
});

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
		if (status == BorrowStatus.NotBorrowed)
			return sendApiValidationError(
				res,
				{
					path: 'gameId',
					message: "The game isn't borrowed and can therefore not be returned"
				},
				'Body'
			);
		if (status == BorrowStatus.NotValid)
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
	res.status(200).json(formatBookings(borrows));
});

const formatBookings = (bookings: any[]) => {
	return bookings.map((booking) => ({
		id: booking.id,
		gameName: booking.game['name'],
		user: booking.user,
		borrowStart: booking.borrowStart,
		borrowEnd: booking.borrowEnd,
		returned: booking.returned
	}));
};

export default borrowRouter;
