import { Inter } from 'next/font/google';
import Head from 'next/head';
import Header from '@/src/components/Header/Header';
import styles from '@/src/pages/admin/organizations/index.module.css';
import AddOrganization from '@/src/components/SiteAdminComponents/AddOrganization/AddOrganization';

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
				<h1>Add organization</h1>
				<div className={styles.break}> </div>

				<AddOrganization />
			</main>
		</>
	);
};

export default Home;
