import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({
	res,
	query
}) => {
	try {
		const data = await fetch(
			`${process.env.BACKEND_ADDRESS}/api/v1/auth/callback?code=${query.code}`
		);

		if (!data.ok) throw new Error('Could not login');

		const setCookie = data.headers.get('Set-Cookie');
		if (!setCookie) throw new Error('No cookie found');

		res.setHeader('Set-Cookie', setCookie);

		return {
			redirect: {
				destination: '/',
				permanent: false
			},
			props: {}
		};
	} catch (_) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			},
			props: {}
		};
	}
};

export const Callback = () => {};

export default Callback;
