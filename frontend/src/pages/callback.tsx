import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import { useApiGet } from '@/src/hooks/apiHooks';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const Callback = () => {
	const router = useRouter();
	const { code } = router.query;

	const { data, error, loading } = useApiGet<string>('/auth/callback?code=' + code);

    useEffect(() => {
        if (data) {
            router.replace('/');
        }
    }, [data])


    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <>
            <p>Error: {error}</p>
        </>;
    }

    


};

export default Callback;
