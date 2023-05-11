import Header from '@/src/components/Header/Header';
import styles from '@/src/pages/index.module.css';
import { redirectIfNotAdmin } from '@/src/utils/loginRedirects';
import Head from 'next/head';


export const getServerSideProps = redirectIfNotAdmin;

export const Home = () => {
	return (
		<>
			<Head>
				<title>GAMES | Admin</title>
				<meta
					name="description"
					content="A service for finding and browsing games in different mediums and formats."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header />
			<main className={styles.mainContainer}>
				<h1>Admin</h1>
				<h2>
					<a href="/admin/organizations">Manage organizations</a>
				</h2>
			</main>
		</>
	);
};

export default Home;
