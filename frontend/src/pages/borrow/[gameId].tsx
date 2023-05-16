import Head from 'next/head';
import { useRouter } from 'next/router';
import BorrowGame from '@/src/components/BorrowGame/BorrowGame';
import Header from '@/src/components/Header/Header';
import { redirectIfNotLoggedIn } from '@/src/utils/loginRedirects';

export const getServerSideProps = redirectIfNotLoggedIn;

export const Home = () => {
	const router = useRouter();
	const { gameId } = router.query;
	return (
		<>
			<Head>
				<title>GAMES | Borrow a game</title>
				<meta
					name="description"
					content="A service for finding and browsing games in different mediums and formats."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header />
			<main>
				<BorrowGame game={Array.isArray(gameId) ? '' : gameId} />
			</main>
		</>
	);
};

export default Home;
