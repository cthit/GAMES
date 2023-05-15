import Head from 'next/head';
import BookingsList from '../components/BookingsList/BookingsList';
import Header from '../components/Header/Header';
import styles from './index.module.scss';

export const Bookings = () => {
	return (
		<>
			<Head>
				<title>GAMES | Bookings</title>
				<meta
					name="description"
					content="A service for finding and browsing games in different mediums and formats."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header />
			<main className={styles.mainContainer}>
				<BookingsList />
			</main>
		</>
	);
};

export default Bookings;
