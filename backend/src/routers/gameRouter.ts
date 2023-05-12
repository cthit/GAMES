import { Router } from 'express';
import { z } from 'zod';
import {
	processRequestQuery,
	validateRequestBody
} from 'zod-express-middleware';
import { GammaUser } from '../models/gammaModels.js';
import {
	getGameOwnerIdFromCid,
	getGameOwnerNameFromId,
	getGameOwnersWithGames,
	isGameOwner
} from '../services/gameOwnerService.js';
import {
	createGame,
	getGameById,
	markGameAsPlayed,
	removeGame,
	markGameAsNotPlayed,
	searchAndFilterGames
} from '../services/gameService.js';
import { platformExists } from '../services/platformService.js';
import { getAverageRating, getUserRating } from '../services/ratingService.js';
import sendApiValidationError from '../utils/sendApiValidationError.js';
import { getAccountFromCid } from '../services/accountService.js';
import { PlayStatus } from '@prisma/client';


const gameRouter = Router();

const isInt = /^\d+$/;
const intMessage = { message: 'Not an integer.' };
const gamesQuerySchema = z
	.object({
		search: z.string().min(1).max(500).optional(),
		platform: z.string().min(1).optional(),
		releaseBefore: z.string().datetime().optional(), // ISO date string
		releaseAfter: z.string().datetime().optional(), // ISO date string
		playtimeMin: z.string().min(1).max(6).regex(isInt, intMessage).optional(),
		playtimeMax: z.string().min(1).max(6).regex(isInt, intMessage).optional(),
		playerCount: z.string().min(1).max(4).regex(isInt, intMessage).optional(),
		owner: z.string().cuid2().optional(),
		location: z.string().min(1).max(500).optional()
	})
	// This is a work around for the fact that zod-express-middleware doesn't support
	// non-string values in query parameters.
	.transform((data) => {
		const playerCount = data.playerCount
			? parseInt(data.playerCount)
			: undefined;
		return {
			...data,
			playerMax: playerCount,
			playerMin: playerCount,
			playtimeMin: data.playtimeMin ? parseInt(data.playtimeMin) : undefined,
			playtimeMax: data.playtimeMax ? parseInt(data.playtimeMax) : undefined,
			releaseBefore: data.releaseBefore
				? new Date(data.releaseBefore)
				: undefined,
			releaseAfter: data.releaseAfter ? new Date(data.releaseAfter) : undefined,
			gameOwnerId: data.owner
		};
	});

/**
 * @api {get} /api/v1/games Get Games
 * @apiName GetGames
 * @apiGroup Games
 * @apiDescription Get all public games matching the specified query
 *
 * @apiQuery {String} search Search term
 * @apiQuery {String} platform Platform the game is played on
 * @apiQuery {String} releaseBefore Filters to games released before a specific date
 * @apiQuery {String} releaseAfter Filters to games released after a specific date
 * @apiQuery {Number} playtimeMin Minimum playtime of the games
 * @apiQuery {Number} playtimeMax Maximum playtime of the games
 * @apiQuery {Number} playerCount Amount of players that should be able to play the games
 * @apiQuery {String} owner CUID of the owner of the games
 * @apiQuery {String} location Location of the games
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
 *	  "releaseDate": "2023-04-13T00:00:00.000Z",
 *	  "playtime": 60,
 *	  "playerMin": 1,
 *	  "playerMax": 5
 *	  "location": "Hubben",
 * 	  "isBorrowed": "false",
 * 	  "isPlayed": "false",
 *    (nullable) "ratingAvg": 4.5,
 *    (nullable) "ratingUser": 4,
 *   }
 * ]
 */
gameRouter.get('/', processRequestQuery(gamesQuerySchema), async (req, res) => {
	const games = await searchAndFilterGames(req.query);

	const formattedGames = await formatGames(
		games,
		req.isAuthenticated() ? (req.user as GammaUser) : null
	);

	res.status(200).json(formattedGames);
});

const addGameSchema = z.object({
	name: z.string().min(1).max(250),
	description: z.string().min(1).max(2000),
	platform: z.string().min(1),
	releaseDate: z.string().datetime(), // ISO date string
	playtime: z.number().int().min(1),
	playerMin: z.number().int().min(1),
	playerMax: z.number().int().min(1), //Maybe check that max > min?
	location: z.string().min(1).max(250)
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
 * @apiBody {String} location Location of the game
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
 *
 * @apiError (401) {object} Unauthorized Must be logged in to add game
 * @apiErrorExample {json} 401 Unauthorized:
 * {
 * 	"message": "Must be logged in to add game"
 * }
 * @apiErrorExample {json} 400 Bad Request:
 * {
 * 	"message": "Something went wrong adding the game"
 * }
 * @apiErrorExample {json} 500 Internal Server Error:
 * {
 * 	"message": "Internal server error or something"
 * }
 */
gameRouter.post(
	'/add',
	validateRequestBody(addGameSchema),
	async (req, res) => {
		try {
			if (!req.user) {
				return res
					.status(401)
					.json({ message: 'Must be logged in to add game' });
			}

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

			await createGame(
				body.name,
				body.description,
				body.platform,
				new Date(body.releaseDate),
				body.playtime,
				body.playerMin,
				body.playerMax,
				body.location,
				// @ts-expect-error GammaUser not added to Request.user type
				await getGameOwnerIdFromCid(req.user.cid)
			);

			res.status(200).json({ message: 'Game added' });
		} catch (e) {
			if (e instanceof Error) {
				res
					.status(400)
					.json({ message: 'Something went wrong adding the game' });
			} else {
				res.status(500).json({
					message: 'Uwu oopsie woopsie, the devs made a fucky wucky! Sowwy'
				});
			}
		}
	}
);

/**
 * @api {delete} /api/v1/games/:id Remove a game
 * @apiName Remove Game
 * @apiGroup Games
 * @apiDescription Removes the given game
 *
 * @apiParam {String} gameId The CUID of the game to delete
 *
 * @apiSuccess {String} message Message indicating success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 	"message": "Game Removed"
 * }
 *
 * @apiErrorExample {json} 401 Unauthorized:
 * {
 * 	"message": "Must be logged in to remove game"
 * }
 */
gameRouter.delete('/:id', async (req, res) => {
	try {
		if (!req.user) {
			res.status(401).json({ message: 'Must be logged in to remove game' });
			return;
		}

		// @ts-ignore It is in fact a GammaUser
		if (!isGameOwner(req.user, req.params.id))
			return res.status(403).json({ message: 'You do not own that game!' });

		await removeGame(req.params.id);

		res.status(200).json({ message: 'Game removed' });
	} catch (e) {
		if (e instanceof Error) res.status(400).json({ message: e.message });
		else res.status(500).json({ message: 'Error removing game' });
	}
});

/**
 * @api {post} /api/v1/games/markPlayed/:id Saves that a user has played a game
 * @apiName markPlayed
 * @apiGroup Games
 * @apiDescription Marks the game as played for the user
 *
 * @apiParam {String} gameId Id of the game
 *
 * @apiSuccess {String} message Message indicating success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *    "message": "Game marked as played"
 *   }
 *
 * @apiErrorExample {json} Unauthorized:
 * HTTP/1.1 401 Unauthorized
 *   {
 *    "message": "Unauthorized"
 *   }
 *
 * @apiUse ZodError
 */
gameRouter.post('/markPlayed/:gameId', async (req, res) => {
	try {
		if (!req.isAuthenticated()) return res.status(401).json({ message: 'Unauthorized' });
		await markGameAsPlayed(req.params.gameId, (req.user as GammaUser).cid);
		res.status(200).json({ message: 'Game marked as played' });
	} catch (e) {
		if (e instanceof Error)
			res.status(500).json({ message: e.message });
		else
			res.status(500).json({ message: 'Error marking game as played' });
	}
});

/**
 * @api {post} /api/v1/games/markNotPlayed Saves that a user has played a game
 * @apiName markPlayed
 * @apiGroup Games
 * @apiDescription Marks the game as played for the user
 *
 * @apiParam {String} gameId Id of the game
 *
 * @apiSuccess {String} message Message indicating success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *   {
 *    "message": "Game marked as not played"
 *   }
 * @apiErrorExample {json} Unauthorized:
 * HTTP/1.1 401 Unauthorized
 *   {
 *    "message": "Unauthorized"
 *   }
 *
 * @apiUse ZodError
 */
gameRouter.post('/markNotPlayed/:gameId', async (req, res) => {
	try {
		if (!req.isAuthenticated()) return res.status(401).json({ message: 'Unauthorized' });
		await markGameAsNotPlayed(req.params.gameId, (req.user as GammaUser).cid);
		res.status(200).json({ message: 'Game marked as not played' });
	} catch (e) {
		if (e instanceof Error)
			res.status(500).json({ message: e.message });
		else
			res.status(500).json({ message: 'Error marking game as not played' });
	}
});

/**
 * @api {get} /api/v1/games/owners Get all game owners
 * @apiName GetOwners
 * @apiGroup Games
 * @apiDescription Gets all game owners
 *
 * @apiSuccess {Object[]} Owners List of game owners
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "id": "clgkri8kk0000przwvkvbyj95",
 *   "name": "Game Owner 1"
 *  },
 *  {
 *   "id": "clgkri8ku0000przwvkvbyj95",
 *   "name": "Game Owner 2"
 *  }
 * ]
 **/
gameRouter.get('/owners', async (req, res) => {
	const owners = await getGameOwnersWithGames();

	const formattedOwners = await Promise.all(
		owners.map(async (owner) => ({
			id: owner.id,
			name: await getGameOwnerNameFromId(owner.id)
		}))
	);

	res.status(200).json(formattedOwners);
});

/**
 * @api {get} /api/v1/game/:gameId/owner Get the owner of a game
 * @apiParam {String} gameId Game id
 * @apiName GetGameOwner
 * @apiGroup Games
 * @apiDescription Gets the current owner of a given game
 *
 * @apiSuccess {String} gameOwner The ID of the owner of the game
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "gameOwner": "clgzcxo5o0002lpr0sz7d5t5k"
 * }
 *
 * @apiUse ZodError
 */
gameRouter.get('/:gameId/owner', async (req, res) => {
	const game = await getGameById(req.params.gameId);

	if (!game) return res.status(404).json({ message: 'Game not found' });

	return res.status(200).json({
		gameOwner: game?.gameOwnerId
	});
});

const formatGames = async (games: any[], user: GammaUser | null) => {
	const uid = user ? (await getAccountFromCid(user.cid))?.id : null;
	return await Promise.all(
		games.map(async (game) => ({
			id: game.id,
			name: game.name,
			description: game.description,
			platformName: game.platformName,
			releaseDate: game.dateReleased.toISOString().split('T')[0], // `toISOString()` returns a string in the format `YYYY-MM-DDTHH:mm:ss.sssZ`, we only want the date
			playtimeMinutes: game.playtimeMinutes,
			playerMin: game.playerMin,
			playerMax: game.playerMax,
			location: game.location,
			owner: await getGameOwnerNameFromId(game.gameOwnerId),
			isBorrowed:
				game.borrow.filter((b: { returned: boolean }) => {
					return !b.returned;
				}).length > 0,
			ratingAvg: await getAverageRating(game.id),
			ratingUser: user ? await getUserRating(game.id, user.cid) : null,
			isPlayed: user ? (game.playStatus.filter((status: PlayStatus) => { return status.userId == uid })).length > 0 : false
		}))
	);
};

export default gameRouter;
