import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useMarkAsPlayed = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { gameId: string }) =>
			axios.post('/api/v1/games/markPlayed', data),
		onSuccess: () => {
			queryClient.invalidateQueries(['gamesList']);
		}
	});
};
