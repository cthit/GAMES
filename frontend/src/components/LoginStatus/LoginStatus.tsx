import { useApiGet, useApiPost } from '@/src/hooks/apiHooks';
import { FC, useEffect } from 'react';


const LoginStatus: FC = () => {

    const { data, error, loading } = useApiGet<string>('/auth/user');

    const { postData, loading: postLoading, error: postError, success } = useApiPost('/auth/logout');

    useEffect(() => {
        if (success) {
            window.location.reload();
        }
    }, [success])

    if (loading || postLoading ) {
        return <div>Loading...</div>;
    }

    if (data) {
        return (
            <div>
                {/* @ts-ignore */}
                <span style={{ marginLeft: '5px' }}>Logged in as {data.cid}</span>
                <a style={{ marginLeft: '5px', textDecoration: 'underline', color: 'blue', cursor: 'pointer' }} onClick={() => postData(undefined)}>Logout</a>
            </div>
        )
    }

    return (
        <div>
            <a style={{ marginLeft: '5px' }} href='/api/v1/auth/login' >Login</a>
        </div>
    )
}

export default LoginStatus;