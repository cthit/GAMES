import { Router } from 'express';
import { z } from 'zod';
import { validateRequestBody } from 'zod-express-middleware';
import {
	createRating,
	getUserRating,
	getAverageRating,
	getGameRatings
} from '../services/ratingService.js';
import { GammaUser } from '../models/gammaModels.js';
import { isAuthenticated } from '../middleware/authenticationCheckMiddleware.js';

const ratingRouter = Router();

const rateSchema = z.object({
	game: z.string().min(1).max(250),
	rating: z.number().int().min(1).max(5),
	motivation: z.string().min(1).max(1000).optional()
});

/**
 * @api {post} /api/v1/rating/rate Rate a game
 * @apiName RateGame
 * @apiGroup Rating
 * @apiDescription Gives a specific game a rating
 *
 * @apiBody {Number} rating Number between 0-5
 * @apiBody {String} motivation Motivation of the rating
 *
 * @apiSuccess {String} message Message indicating success
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 	"message": "Game rated successfully"
 * }
 *
 * @apiUse ZodError
 *
 * @apiError (401) {object} Unauthorized Must be logged in to rate game
 * @apiErrorExample {json} 401 Unauthorized:
 * {
 * 	"message": "Must be logged in to rate game"
 * }
 */
ratingRouter.post(
	'/rate',
	isAuthenticated,
	validateRequestBody(rateSchema),
	async (req, res) => {

		const user = req.user as GammaUser;
		createRating(req.body.game, user.cid, req.body.rating, req.body.motivation);
		res.status(200).json({ message: 'Game rated successfully' });
	}
);

const getRatingSchema = z.object({
	game: z.string().min(1).max(250)
});

/**
 * @api {get} /api/v1/rating/user/[gameId] Get Rating for User
 * @apiParam {String} gameId ID of the game
 * @apiName GetUserRating
 * @apiGroup Rating
 * @apiDescription Gets the rating for a game for current user
 *
 * @apiSuccess {Object} rating Rating of the game
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *   "rating": 1
 *  }
 *
 * @apiUse ZodError
 *
 * @apiError (401) {object} Unauthorized Must be logged in to get own rating
 * @apiErrorExample {json} 401 Unauthorized:
 * {
 * 	"message": "Must be logged in to get own rating"
 * }
 */
ratingRouter.get('/user/:gameId', async (req, res) => {
	if (!req.isAuthenticated()) {
		res.status(401).json({ message: 'Must be logged in to get own rating' });
		return;
	}
	const user = req.user as GammaUser;
	const rating = await getUserRating(req.params.gameId, user.cid);
	res.status(200).json({ rating: rating });
});

/**
 * @api {get} /api/v1/rating/game/average/[gameId] Get average Rating for Game
 * @apiParam {String} gameId ID of the game
 * @apiName GetAverageRating
 * @apiGroup Rating
 * @apiDescription Gets the average rating for a game
 *
 * @apiSuccess {Object} rating Rating of the game
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *   "rating": 0.85
 *  }
 *
 * @apiUse ZodError
 *
 */
ratingRouter.get('/game/average/:gameId', async (req, res) => {
	let rating = await getAverageRating(req.params.gameId);
	res.status(200).json({ rating: rating });
});

/**
 * @api {get} /api/v1/rating/game/[gameId] Get all ratings and motivations for game
 * @apiParam {String} gameId ID of the game
 * @apiName GetRating
 * @apiGroup Rating
 * @apiDescription Gets all ratings of a game
 *
 * @apiSuccess {Object} rating Rating of the game
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 * 	{
 *   		"rating": 3,
 * 		"motivation": "It's okay"
 *  	}
 * ]
 *
 * @apiUse ZodError
 *
 */
ratingRouter.get('/game/:gameId', async (req, res) => {
	let ratings = await getGameRatings(req.params.gameId);
	console.log(ratings);
	res.status(200).json(ratings);
})

export default ratingRouter;
