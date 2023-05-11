import { useLogout, useUser } from '@/src/hooks/api/auth';
import { FC } from 'react';

const LoginStatus: FC = () => {
	const { data, isLoading } = useUser();
	const { mutate, isLoading: logoutLoading } = useLogout();

	if (isLoading || logoutLoading) {
		return <div>Loading...</div>;
	}

	if (data) {
		return (
			<div>
				{/* @ts-ignore */}
				<span style={{ marginLeft: '5px' }}>Logged in as {data.nick}</span>
				<a
					style={{
						marginLeft: '5px',
						textDecoration: 'underline',
						color: 'blue',
						cursor: 'pointer'
					}}
					onClick={() => mutate()}
				>
					Logout
				</a>
			</div>
		);
	}

	return (
		<div>
			<a style={{ marginLeft: '5px' }} href="/api/v1/auth/login">
				Login
			</a>
		</div>
	);
};

export default LoginStatus;
