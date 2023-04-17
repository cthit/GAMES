import axios from 'axios';
import { Game } from '../../src/types/Game';

const url = 'http://localhost:8080/api/v1/games';

describe('The router', () => {
	test('The get route', async () => {
		const res = await axios.get(url);

		expect(res).toBeTruthy();
		expect(res.status).toBe(200);
		expect(res.data).toBeInstanceOf(Array<Game>);
	});
});
