import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

interface Platform {
	name: string;
}

export const usePlatforms = () => {
	return useQuery<Platform[], AxiosError>({
		queryKey: ['platforms'],
		queryFn: () => axios.get('/api/v1/platforms').then((res) => res.data)
	});
};
