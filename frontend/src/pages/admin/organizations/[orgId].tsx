import { Inter } from 'next/font/google';
import Head from 'next/head';
import Header from '@/src/components/Header/Header';
import styles from '@/src/pages/admin/organizations/index.module.css';
import { useRouter } from 'next/router';
import ManageOrganization from '@/src/components/SiteAdminComponents/ManageOrganization/ManageOrganization';
import RemoveOrganizationButton from '@/src/components/SiteAdminComponents/RemoveOrganizationButton/RemoveOrganizationButton';

const inter = Inter({ subsets: ['latin'] });

export const Home = () => {
	const router = useRouter();
	const { orgId } = router.query;

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
				<h1>Manage organization</h1>
				<ManageOrganization organizationId={orgId as string} />
				<RemoveOrganizationButton orgId={orgId as string} />
			</main>
		</>
	);
};

export default Home;
