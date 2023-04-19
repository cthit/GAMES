import supertest from 'supertest';
import app from '../../src/app';

const request = supertest(app);

const game = {
	name: 'Test Game',
	description: 'Test Description',
	platform: 'Test Platform',
	releaseDate: '2023-04-13',
	playtime: '60'
};

describe('Testing gameRouter.ts', () => {
	test('Test adding a platform', async () => {
		const res = await request
			.post('/api/v1/platforms/add')
			.send({ name: 'Test Platform' });
		expect(res).toBeTruthy();
		expect(res.status).toBe(200);
	});
	test('Test adding a game', async () => {
		const res = await request.post('/api/v1/games/add').send(game);
		expect(res).toBeTruthy();
		expect(res.status).toBe(200);
	});
	test('Test fetching games', async () => {
		const res = await request.get('/api/v1/games');
		expect(res).toBeTruthy();
		expect(res.status).toBe(200);
		expect(res.body).toBeInstanceOf(Array);
	});
});
