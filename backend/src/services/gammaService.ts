import axios from 'axios';
import { GammaUser } from '../models/gammaModels';

const apiKey = process.env.GAMMA_API_KEY;
const gammaUrl = process.env.GAMMA_ROOT_URL?.replace(/\/$/, '');

export const getGammaUser = async (cid: string) => {
	return gammaGetRequest<GammaUser>(`/users/${cid}`);
};

const gammaGetRequest = async <T>(path: string): Promise<T> => {
	const response = await axios.get(gammaUrl + '/api' + path, {
		headers: {
			Authorization: 'pre-shared ' + apiKey
		}
	});

	if (response.status < 200 || response.status >= 300) {
		throw new Error(`Gamma request failed with status ${response.status}`, {
			cause: response.data
		});
	}

	return response.data;
};
