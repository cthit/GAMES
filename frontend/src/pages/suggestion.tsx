import Head from 'next/head';
import Header from '../components/Header/Header';
import SuggestionsList from '../components/SuggestionsList/SuggestionsList';
import styles from './suggestion.module.scss';

export const Home = () => {
	return (
		<>
			<Head>
				<title>SUGGESTIONS</title>
				<meta
					name="description"
					content="A service for finding and browsing games in different mediums and formats."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header />
			<main className={styles.mainContainer}>
				<SuggestionsList />
			</main>
		</>
	);
};

export default Home;
