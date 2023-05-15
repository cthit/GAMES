import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

export const useAddPlatform = () => {
	const queryClient = useQueryClient();

	return useMutation<
		unknown,
		AxiosError,
		{
			name: string;
		}
	>({
		mutationFn: (data) => axios.post('/api/v1/platforms/add', data),
		onSuccess: () => {
			queryClient.invalidateQueries(['platforms']);
		}
	});
};
