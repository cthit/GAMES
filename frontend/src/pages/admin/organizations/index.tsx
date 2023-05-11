import Header from '@/src/components/Header/Header';
import OrganizationList from '@/src/components/SiteAdminComponents/OrganizationList/OrganizationList';
import styles from '@/src/pages/admin/organizations/index.module.css';
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
				<h1>Manage organizations</h1>
				<div className={styles.break} />

				<a href="/admin/organizations/add">Add organization</a>
				<div className={styles.break} />

				<OrganizationList />
			</main>
		</>
	);
};

export default Home;
