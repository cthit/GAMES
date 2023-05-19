import { isValidDateObject } from '@/src/utils/validation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useDebounce } from '../useDebounce';

export interface Game {
	id: string;
	name: string;
	description: string;
	platformName: string;
	playtimeMinutes: number;
	releaseDate: string;
	isBorrowed: boolean;
	playerMin: number;
	playerMax: number;
	location: string;
	owner: string;
	ratingAvg: number | null;
	ratingUser: number | null;
	isPlayed: boolean;
}

interface Filter {
	platform?: string;
	releaseBefore?: Date;
	releaseAfter?: Date;
	playtimeMax?: number;
	playtimeMin?: number;
	playerCount?: number;
	location?: string;
	owner?: string;
}

export const useGamesList = (searchTerm?: string, filter?: Filter) => {
	const search = useDebounce(searchTerm ? searchTerm : undefined, 300); // Ternary to avoid empty string
	const changedFilter = useDebounce(filter, 500);

	const filterKeys = changedFilter
		? // @ts-ignore It does have keys that are strings. TypeScript is just being dumb.
		  Object.keys(changedFilter).map((key) => key + '-' + changedFilter[key])
		: [];

	return useQuery<Game[], AxiosError>({
		queryKey: ['gamesList', search, ...filterKeys],
		queryFn: () =>
			axios
				.get('/api/v1/games', {
					params: {
						search,
						platform: filter?.platform ? filter.platform : undefined,
						releaseBefore: isValidDateObject(filter?.releaseBefore)
							? filter?.releaseBefore
							: undefined,
						releaseAfter: isValidDateObject(filter?.releaseAfter)
							? filter?.releaseAfter
							: undefined,
						playtimeMax: filter?.playtimeMax ? filter.playtimeMax : undefined,
						playtimeMin: filter?.playtimeMin ? filter.playtimeMin : undefined,
						playerCount: filter?.playerCount ? filter.playerCount : undefined,
						location: filter?.location ? filter.location : undefined,
						owner: filter?.owner ? filter.owner : undefined
					}
				})
				.then((res) => res.data)
	});
};

export const useGame = (gameId: string) => {
	return useQuery<Game, AxiosError>({
		queryKey: ['game', gameId],
		queryFn: () => {
			// This is done here as we cannot conditionally call useQuery
			if (!gameId) throw new AxiosError("Game ID can't be empty", '400');

			return axios.get(`/api/v1/games/${gameId}`).then((res) => res.data);
		}
	});
};

export const useGameRemover = (redirect: string = '') => {
	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => axios.delete(`/api/v1/games/${id}`),
		onSuccess: () => {
			queryClient.invalidateQueries(['gamesList']);
			if (redirect) router.push(redirect);
		}
	});
};

export const useGameOwner = (gameId: string) => {
	return useQuery<string, AxiosError>({
		queryKey: ['gameOwner', gameId],
		queryFn: () =>
			axios
				.get(`/api/v1/games/${gameId}/owner`)
				.then((res) => res.data.gameOwner)
	});
};
