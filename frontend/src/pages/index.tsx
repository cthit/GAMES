import { Inter } from 'next/font/google';
import Head from 'next/head';
import GamesList from '../components/GamesList/GamesList';
import Header from '../components/Header/Header';

const inter = Inter({ subsets: ['latin'] });

export const Home = () => {
	return (
		<>
			<Head>
				<title>GAMES</title>
				<meta
					name="description"
					content="A service for finding and browsing games in different mediums and formats."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header />
			<main>
				<GamesList />
			</main>
		</>
	);
};

export default Home;
