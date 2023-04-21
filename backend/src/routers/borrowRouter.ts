import { Router } from 'express';
import { z } from 'zod';
import { validateRequestBody } from 'zod-express-middleware';
import { borrowGame, returnGame } from '../services/borrowService.js';

const borrowRouter = Router();

const borrowSchema = z.object({
	gameId: z.string().min(1),
	user: z.string().min(1),
	borrowStart: z.string().datetime(),
	borrowEnd: z.string().datetime()
});

/**
 * @api {post} /api/v1/games/borrow Borrow a game
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
	const body = req.body;
	await borrowGame(
		body.gameId,
		body.user,
		new Date(body.borrowStart),
		new Date(body.borrowEnd)
	);
	res.status(200).json({ message: 'Game successfully borrowed' });
});

const returnSchema = z.object({
	gameId: z.string().min(1),
	user: z.string().min(1)
});

/**
 * @api {post} /api/v1/games/return Returns a borrowed game
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
		await returnGame(body.gameId, body.user);
		res.status(200).json({ message: 'Game successfully returned' });
	}
);

export default borrowRouter;
