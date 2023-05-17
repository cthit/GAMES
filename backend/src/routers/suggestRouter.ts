import { Router } from 'express';
import { z } from 'zod';
import { validateRequestBody } from 'zod-express-middleware';
import { platformExists } from '../services/platformService.js';
import {
	createSuggestion,
	getAllSuggestions
} from '../services/suggestService.js';
import sendApiValidationError from '../utils/sendApiValidationError.js';

const suggestRouter = Router();

/**
 * @api {get} /api/v1/suggestions Request Suggestions
 * @apiName GetSuggestions
 * @apiGroup Suggestions
 * @apiDescription Get all public suggestions
 *
 * @apiSuccess {Object[]} suggestions List of suggestions
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  [
 *   {
 *    "name": "Game 1",
 *    "description": "Game 1 description",
 * 	  "platformName": "Steam",
 *	  "releaseDate": "2023-04-13T00:00:00.000Z",
 *	  "playtime": 60,
 *	  "playerMin": 1,
 *	  "playerMax": 5
 *   }
 * ]
 */
suggestRouter.get('/', async (req, res) => {
	const suggestion = await getAllSuggestions();
	const formattedSuggestion = formatSuggestion(suggestion);
	res.status(200).json(formattedSuggestion);
});

const addSuggestionSchema = z
	.object({
		name: z.string().min(1).max(250),
		description: z.string().min(1).max(2000),
		platform: z.string().min(1),
		releaseDate: z.string().datetime(), // ISO date string
		playtime: z.number().int().min(1),
		playerMin: z.number().int().min(1),
		playerMax: z.number().int().min(1),
		motivation: z.string().min(1).max(2000)
	})
	.refine((data) => data.playerMax >= data.playerMin, {
		message: 'PlayerMax must be greater than or equal to PlayerMin',
		path: ['playerMax', 'playerMin']
	});

/**
 * @api {post} /api/v1/suggestions/add Add a suggestion
 * @apiName AddSuggestion
 * @apiGroup Suggestions
 * @apiDescription Adds a suggestion to the service
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
suggestRouter.post(
	'/add',
	validateRequestBody(addSuggestionSchema),
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

		if (body.playerMin > body.playerMax) {
			return sendApiValidationError(
				res,
				{
					path: 'playerMax',
					message: 'Maximum player can not be bigger than minimum'
				},
				'Body'
			);
		}

		await createSuggestion(
			body.name,
			body.description,
			body.platform,
			new Date(body.releaseDate),
			body.playtime,
			body.playerMin,
			body.playerMax,
			body.motivation
		);

		res.status(200).json({ message: 'Suggestion added' });
	}
);

const formatSuggestion = (suggestions: any[]) => {
	return suggestions.map((suggestion) => ({
		id: suggestion.id,
		name: suggestion.name,
		description: suggestion.description,
		platformName: suggestion.platformName,
		releaseDate: suggestion.dateReleased.toISOString().split('T')[0], // `toISOString()` returns a string in the format `YYYY-MM-DDTHH:mm:ss.sssZ`, we only want the date
		playtimeMinutes: suggestion.playtimeMinutes,
		playerMin: suggestion.playerMin,
		playerMax: suggestion.playerMax,
		motivation: suggestion.motivation
	}));
};

export default suggestRouter;
