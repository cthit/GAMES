import { Router } from 'express';
import { z } from 'zod';
import { sendError, validateRequestBody } from 'zod-express-middleware';
import { createGame } from '../services/gameService.js';
import { platformExists } from '../services/platformService.js';
import sendApiValidationError from '../utils/sendApiValidationError.js';

const gameRouter = Router();

/**
 * @api {get} /api/v1/games Request Games
 * @apiName GetGames
 * @apiGroup Games
 * @apiDescription Get all public games
 *
 * @apiSuccess {Object[]} games List of games
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *   {
 *    "id": 1,
 *   "name": "Game 1",
 *  "description": "Game 1 description",
 * 	"platform": "Steam",
 *	"release_date": "2023-04-13",
 *	"playtime": "60"
 *  }
 * ]
 */
gameRouter.get('/', (req, res) => {
	const games = [
		{
			id: 1,
			name: 'Game 1',
			description: 'Game 1 description',
			platform: 'Boardgame',
			release_date: '2019-01-01',
			playtime: '60-90'
		},
		{
			id: 2,
			name: 'Game 2',
			description: 'Game 2 description',
			platform: 'Steam',
			release_date: '2020-05-11',
			playtime: '45-80'
		},
		{
			id: 3,
			name: 'Game 3',
			description: 'Game 3 description',
			platform: 'Playstation 4',
			release_date: '2018-12-12',
			playtime: '100-150'
		}
	];

	res.status(200).json(games);
});

const addGameSchema = z.object({
	name: z.string().min(1).max(250),
	description: z.string().min(1).max(2000),
	platform: z.string().min(1),
	releaseDate: z.string().datetime(), // ISO date string
	playtime: z.number().int().min(1)
});

/**
 * @api {post} /api/v1/games/add Add a game
 * @apiName AddGame
 * @apiGroup Games
 * @apiDescription Adds a game to the service
 *
 * @apiBody {String} name Name of the game
 * @apiBody {String} description Description of the game
 * @apiBody {String} platform Platform the game is played on
 * @apiBody {String} releaseDate Date the game was released
 * @apiBody {Number} playtime Playtime of the game
 *
 * @apiSuccess {String} message Message indicating success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 	"message": "Game added"
 * }
 */
gameRouter.post(
	'/add',
	validateRequestBody(addGameSchema),
	async (req, res) => {
		const body = req.body;

		if (!(await platformExists(body.platform))) {
			return sendApiValidationError(
				res,
				{
					path: 'platform',
					message: 'Platform does not exist'
				},
				'Body'
			);
		}

		if (body.releaseDate > new Date().toISOString()) {
			return sendError(
				{
					type: 'Body',
					errors: z.ZodError.create([
						{
							path: ['releaseDate'],
							message: 'Release date cannot be in the future',
							code: 'custom'
						}
					])
				},
				res
			);
		}

		await createGame(
			body.name,
			body.description,
			body.platform,
			new Date(body.releaseDate),
			body.playtime
		);

		res.status(200).json({ message: 'Game added' });
	}
);

export default gameRouter;
