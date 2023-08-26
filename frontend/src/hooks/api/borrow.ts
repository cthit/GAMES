import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

export const useBorrowRequestList = () => {
	return useQuery<
		{
			id: string;
			gameId: string;
			name: string;
			user: string;
			borrowStart: string;
			borrowEnd: string;
		}[],
		AxiosError
	>(['borrowRequestList'], () =>
		axios.get('/api/v1/borrow/request/list').then((res) => res.data)
	);
};

export const useBorrowRequest = () => {
	const queryClient = useQueryClient();

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
			axios.post('/api/v1/borrow/request', data).then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries(['borrowRequestList']);
		}
	});
};

export const useBorrowRequestRespond = () => {
	const queryClient = useQueryClient();

	return useMutation<
		unknown,
		AxiosError,
		{
			borrowId: string;
			approved: boolean;
		}
	>({
		mutationFn: async (data) =>
			axios
				.post('/api/v1/borrow/request/respond', data)
				.then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries(['borrowRequestList']);
			queryClient.invalidateQueries(['borrowsList']);
		}
	});
};

export const useBorrowsList = () => {
	return useQuery<
		{
			gameName: string;
			user: string;
			borrowStart: string;
			borrowEnd: string;
		}[],
		AxiosError
	>(['borrowsList'], () =>
		axios.get('/api/v1/borrow/list').then((res) => res.data)
	);
};

export const useOwnBorrowsList = () => {
	return useQuery<
		{
			gameName: string;
			user: string;
			borrowStart: string;
			borrowEnd: string;
		}[],
		AxiosError
	>(['ownBorrowsList'], () =>
		axios.get('/api/v1/borrow/list/ownGames').then((res) => res.data)
	);
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
