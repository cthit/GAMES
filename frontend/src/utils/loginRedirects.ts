import type { IncomingMessage } from 'http';
import { GetServerSideProps } from 'next';

export const redirectIfNotAdmin: GetServerSideProps = async ({ req }) => {
	const res = await getLoginStatus(req);

	if (!res.ok) {
		return {
			redirect: {
				destination: '/api/v1/auth/login'
			},
			props: {}
		};
	}

	const user = await res.json();

	if (!user.isSiteAdmin) {
		return {
			redirect: {
				destination: '/'
			},
			props: {}
		};
	}

	return {
		props: {}
	};
};

export const redirectIfNotLoggedIn: GetServerSideProps = async ({ req }) => {
	const res = await getLoginStatus(req);

	if (!res.ok) {
		return {
			redirect: {
				destination: '/api/v1/auth/login'
			},
			props: {}
		};
	}

	return {
		props: {}
	};
};

const getLoginStatus = async (req: IncomingMessage) => {
	if (process.env.BACKEND_ADDRESS === undefined)
		throw new Error('BACKEND_ADDRESS is undefined');

	return await fetch(`${process.env.BACKEND_ADDRESS}/api/v1/auth/user`, {
		headers: {
			cookie: req.headers.cookie,
			referer: req.headers.referer,
			host: req.headers.host,
			userAgent: req.headers['user-agent']
		} as HeadersInit
	});
};
