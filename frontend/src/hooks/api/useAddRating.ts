import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useAddRating = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { game: string; rating: number }) =>
			axios.post('/api/v1/rating/rate', data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries(['gamesList']);
			queryClient.invalidateQueries(['game', variables.game]);
		}
	});
};
