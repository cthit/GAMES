import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

export const useAddGameSuggestion = () => {
	const queryClient = useQueryClient();

	return useMutation<
		unknown,
		AxiosError,
		{
			name: string;
			description: string;
			platform: string;
			releaseDate: Date;
			playtime: number;
			playerMin: number;
			playerMax: number;
			location: string;
			motivation: string;
		}
	>({
		mutationFn: (data) => axios.post('/api/v1/games/add', data),
		onSuccess: () => {
			queryClient.invalidateQueries(['gameSuggestions']);
		}
	});
};
