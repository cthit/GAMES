import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useChangePlayStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { gameId: string, played: boolean }) =>
			axios.post(`/api/v1/games/${data.played ? 'markNotPlayed' : 'markPlayed'}/${data.gameId}`),
		onSuccess: () => {
			queryClient.invalidateQueries(['gamesList']);
		}
	});
};
