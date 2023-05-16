import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

interface Suggestion {
	name: string;
	description: string;
	platformName: string;
	playtimeMinutes: string;
	releaseDate: string;
	playerMin: string;
	playerMax: string;
	motivation: string;
}

export const useGameSuggestions = () => {
	return useQuery<Suggestion[], AxiosError>({
		queryKey: ['gameSuggestions'],
		queryFn: () => axios.get('/api/v1/suggest').then((res) => res.data)
	});
};
