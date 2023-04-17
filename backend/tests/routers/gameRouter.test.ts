import supertest from 'supertest';
import app from '../../src/app';
import { Game } from '../../src/types/Game';

const request = supertest(app);

describe('Testing gameRouter.ts', () => {
	test('Test fetching games', async () => {
		const res = await request.get('/api/v1/games');
		expect(res).toBeTruthy();
		expect(res.status).toBe(200);
		expect(res.body).toBeInstanceOf(Array<Game>);
	});
});
