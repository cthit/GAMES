import { useApiGet } from '@/src/hooks/apiHooks';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const Callback = () => {
	const router = useRouter();
	const { code } = router.query;

	const { data, error, loading } = useApiGet<string>(
		'/auth/callback?code=' + code
	);

	useEffect(() => {
		if (data) {
			router.replace('/');
		}
	}, [data]);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Error: {error}</p>;
	}
};

export default Callback;
