import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useBorrowRequest = () => {
	return useMutation({
		mutationFn: async (data: {
			gameId: string;
			borrowStart: Date;
			borrowEnd: Date;
			user: 'User';
		}) => axios.post('/api/v1/borrow/request', data).then((res) => res.data)
	});
};

export const useBorrow = () => {
	return useMutation({
		mutationFn: async (data: {
			gameId: string;
			borrowStart: Date;
			borrowEnd: Date;
			user: 'User';
		}) => axios.post('/api/v1/borrow', data).then((res) => res.data)
	});
};
