import Head from 'next/head';
import AddSuggestion from '../components/AddSuggestion/AddSuggestion';
import Header from '../components/Header/Header';
import { redirectIfNotLoggedIn } from '../utils/loginRedirects';

export const getServerSideProps = redirectIfNotLoggedIn;

export const Home = () => {
	return (
		<>
			<Head>
				<title>GAMES | Add a suggestion</title>
				<meta
					name="description"
					content="A service for finding and browsing games in different mediums and formats."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header />
			<main>
				<AddSuggestion />
			</main>
		</>
	);
};

export default Home;
