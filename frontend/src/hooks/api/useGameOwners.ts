import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

interface Owner {
	id: string;
	name: string;
}

export const useGameOwners = () => {
	return useQuery<Owner[], AxiosError>({
		queryKey: ['gameOwners'],
		queryFn: () => axios.get('/api/v1/games/owners').then((res) => res.data)
	});
};
