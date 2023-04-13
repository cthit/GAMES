import { Router } from 'express';

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
 *  "description": "Game 1 description"
 *  }
 * ]
 */
gameRouter.get('/', (req, res) => {
	const games = [
		{
			id: 1,
			name: 'Game 1',
			description: 'Game 1 description',
			playtime: '60-90' // Playtime in minutes
		},
		{
			id: 2,
			name: 'Game 2',
			description: 'Game 2 description',
			playtime: '45-80'
		},
		{
			id: 3,
			name: 'Game 3',
			description: 'Game 3 description',
			playtime: '100-150'
		}
	];

	res.status(200).json(games);
});

export default gameRouter;
