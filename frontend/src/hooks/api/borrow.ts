import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

export const useBorrowRequest = () => {
	return useMutation<
		unknown,
		AxiosError,
		{
			gameId: string;
			borrowStart: Date;
			borrowEnd: Date;
		}
	>({
		mutationFn: async (data) =>
			axios.post('/api/v1/borrow/request', data).then((res) => res.data)
	});
};

export const useBorrow = () => {
	return useMutation<
		unknown,
		AxiosError,
		{
			gameId: string;
			borrowStart: Date;
			borrowEnd: Date;
		}
	>({
		mutationFn: async (data) =>
			axios.post('/api/v1/borrow', data).then((res) => res.data)
	});
};
