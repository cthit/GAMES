import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useMarkAsPlayed = () => {
	return useMutation({
		mutationFn: (data: { gameId: string }) =>
			axios.post('/api/v1/games/markAsPlayed', data)
	});
};
