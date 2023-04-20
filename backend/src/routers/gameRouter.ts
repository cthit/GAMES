import { Router } from 'express';
import { z } from 'zod';
import { validateRequestBody } from 'zod-express-middleware';
import { createGame, getAllGames } from '../services/gameService.js';
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
 *    "id": "clgkri8kk0000przwvkvbyj95",
 *    "name": "Game 1",
 *    "description": "Game 1 description",
 * 	  "platformName": "Steam",
 *	  "releaseDate": "2023-04-13",
 *	  "playtime": "60"
 *   }
 * ]
 */
gameRouter.get('/', async (req, res) => {
	const games = await getAllGames();

	const formattedGames = games.map((game) => {
		return {
			id: game.id,
			name: game.name,
			description: game.description,
			platformName: game.platformName,
			releaseDate: game.dateReleased.toISOString().split('T')[0], // `toISOString()` returns a string in the format `YYYY-MM-DDTHH:mm:ss.sssZ`, we only want the date
			playtimeMinutes: game.playtimeMinutes,
			playerMin: game.playerMin,
			playerMax: game.playerMax

		};
	});

	res.status(200).json(formattedGames);
});

const addGameSchema = z.object({
	name: z.string().min(1).max(250),
	description: z.string().min(1).max(2000),
	platform: z.string().min(1),
	releaseDate: z.string().datetime(), // ISO date string
	playtime: z.number().int().min(1),
	playerMin: z.number().int().min(1),
	playerMax: z.number().int().min(1) //Maybe check that max > min?
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
 * @apiBody {Number} playerMin PlayerMin of the game
 * @apiBody {Number} playMax PlayerMax of the game
 *
 * @apiSuccess {String} message Message indicating success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 	"message": "Game added"
 * }
 *
 * @apiUse ZodError
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
			return sendApiValidationError(
				res,
				{
					path: 'releaseDate',
					message: 'The release date cannot be in the future'
				},
				'Body'
			);
		}

		await createGame(
			body.name,
			body.description,
			body.platform,
			new Date(body.releaseDate),
			body.playtime,
			body.playerMin,
			body.playerMax,
		);

		res.status(200).json({ message: 'Game added' });
	}
);

export default gameRouter;
