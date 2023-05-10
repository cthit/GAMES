import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useAddRating = () => {
	return useMutation({
		mutationFn: (data: { game: string; rating: number }) =>
			axios.post('/api/v1/rating/rate', data)
	});
};
