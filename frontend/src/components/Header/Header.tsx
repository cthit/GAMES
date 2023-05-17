import UserProfile from '@/src/components/UserProfile/UserProfile';
import { useUser } from '@/src/hooks/api/auth';
import { FC } from 'react';
import styles from './Header.module.scss';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
	return (
		<header className={styles.header}>
			<div className={styles.navigation} >
				<a className={styles.title} href="/">G.A.M.E.S</a>
				<nav className={styles.nav}>
					<PublicLinks />

					<ProtectedLinks />

					<AdminLinks />
				</nav>
			</div>
			<UserProfile />
		</header>
	);
};

const PublicLinks = () => {
	return (
		<>
			<StyledLink name="Browse" href="/" />

			<StyledLink name="Suggestions" href="/suggestion" />

			<StyledLink name="Scheduled Bookings" href="/bookings" />
		</>
	)
}

const ProtectedLinks = () => {
	const { data, isLoading } = useUser();

	if (isLoading) return null;

	if (!data) return null;

	return (
		<>
			<StyledLink name="Add" href="/add" />

			<StyledLink name="Add platform" href="/addplatform" />

			<StyledLink name="Borrow requests" href="/borrowlist" />

			<StyledLink name="Add Suggestion" href="/addsuggestion" />
		</>
	);
};

const AdminLinks = () => {
	const { data, isLoading } = useUser();

	if (isLoading) return null;

	if (!data || !data.isSiteAdmin) return null;

	return (
		<StyledLink name="Admin" href="/admin" />
	);
};

const StyledLink = ({ href, name }: { href: string, name: string }) => {
	const router = useRouter();

	return (
		<Link className={router.pathname === href ? `${styles.link} ${styles.active}` : styles.link} href={href}>
			{name}
		</Link>
	)
}


export default Header;
