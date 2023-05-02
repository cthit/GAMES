import { Inter } from 'next/font/google';
import Head from 'next/head';
import Header from '@/src/components/Header/Header';
import styles from '@/src/pages/index.module.css';
import OrganizationList from '@/src/components/SiteAdminComponents/OrganizationList/OrganizationList';

const inter = Inter({ subsets: ['latin'] });

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
				<h1>Manage organizations</h1>
				<br />

				<OrganizationList />
			</main>
		</>
	);
};

export default Home;
