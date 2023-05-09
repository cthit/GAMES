import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

interface Game {
	id: string;
	name: string;
	description: string;
	platformName: string;
	playtimeMinutes: string;
	releaseDate: string;
	isBorrowed: boolean;
	playerMin: string;
	playerMax: string;
	location: string;
	owner: string;
	ratingAvg: string;
	ratingUser: string;
	isPlayed: boolean;
}

interface Filter {
	search?: string;
	platform?: string;
	releaseBefore?: Date;
	releaseAfter?: Date;
	playtimeMax?: number;
	playtimeMin?: number;
	playerCount?: number;
	location?: string;
	owner?: string;
}

export const usePublicGames = (searchTerm?: string, filter?: Filter) => {
	const filterKeys = filter ? Object.keys(filter) : [];
	const queryStuff = useQuery<Game[], AxiosError>({
		queryKey: ['gamesList', searchTerm, ...filterKeys],
		queryFn: () =>
			axios
				.get('/api/v1/games', {
					params: {
						search: searchTerm,
						...filter
					}
				})
				.then((res) => res.data)
	});

	return queryStuff;
};
