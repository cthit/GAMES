import { Router } from 'express';
import { Game } from '../types/Game';

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
	const games: Game[] = [
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

export default gameRouter;
