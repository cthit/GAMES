import { Router } from 'express';

const gameRouter = Router();

/**
 * @api {get} /api/v1/games
 * @apiName GetGames
 * @apiGroup Games
 * @apiDescription Get all public games
 *
 * @apiSuccess {{ id: number, name: string, description: string}[]} games List of games
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
			platform: 'Boardgame'
		},
		{
			id: 2,
			name: 'Game 2',
			description: 'Game 2 description',
			platform: 'Steam'
		},
		{
			id: 3,
			name: 'Game 3',
			description: 'Game 3 description',
			platform: 'Playstation 4'
		}
	];

	res.status(200).json(games);
});

export default gameRouter;
