import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

interface Group {
	id: string;
	becomesActive?: number;
	becomesInactive?: number;
	description: {
		sv: string;
		en: string;
	};
	function?: {
		sv: string;
		en: string;
	};
	email: string;
	name: string;
	prettyName: string;
	superGroup?: SuperGroup;
	active?: boolean;
}

export interface SuperGroup {
	id: string;
	name: string;
	prettyName: string;
	type: string;
	email: string;
}

interface User {
	cid: string;
	nick: string;
	firstName: string;
	lastName: string;

	email: string;
	phone: string;
	avatarUrl?: string;
	acceptanceYear: number;
	gdpr: boolean;
	language: string;
	authorities: [{ id: string; authority: string }];
	groups: Group[];
	websiteURLs?: string;
	//Internal extension
	isSiteAdmin: boolean;
	gameOwnerId: string;
}

export const useUser = () => {
	return useQuery<User | null, AxiosError>({
		queryKey: ['user'],
		queryFn: async () => {
			try {
				return await axios.get('/api/v1/auth/user').then((res) => res.data);
			} catch (error) {
				const err = error as AxiosError;
				if (err.response?.status === 401) return null;

				throw err;
			}
		}
	});
};

export const useLogout = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => axios.post('/api/v1/auth/logout'),
		onSuccess: () => {
			queryClient.resetQueries(['user']);
			if (window.location.pathname.startsWith('/admin'))
				window.location.href = '/';
		}
	});
};
