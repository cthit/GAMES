import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Game } from './games';

export const useChangePlayStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { gameId: string; played: boolean }) =>
			axios.post(
				`/api/v1/games/${data.played ? 'markNotPlayed' : 'markPlayed'}/${
					data.gameId
				}`
			),
		onMutate: (data) => {
			queryClient.cancelQueries(['game', data.gameId]);
			queryClient.cancelQueries(['gamesList']);

			const previousGameData = queryClient.getQueryData<Game>([
				'game',
				data.gameId
			]);

			const newGameData = queryClient.setQueryData(['game', data.gameId], {
				...previousGameData,
				isPlayed: !data.played
			});

			return {
				previousGameData,
				newGameData
			};
		},
		onError: (_, variables, context) => {
			queryClient.setQueryData(
				['game', variables.gameId],
				context?.previousGameData
			);
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries(['gamesList']);
			queryClient.invalidateQueries(['game', variables.gameId]);
		}
	});
};
