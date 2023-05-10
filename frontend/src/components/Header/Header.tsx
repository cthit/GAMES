import LoginStatus from '@/src/components/LoginStatus/LoginStatus';
import { useUser } from '@/src/hooks/api/auth';
import { FC, useEffect } from 'react';
import styles from './Header.module.css';

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
	return (
		<header className={styles.header}>
			<h1>Extremely Ugly GAMES Header</h1>
			<nav>
				<a href="/">Home</a>

				<ProtectedLinks />

				<a style={{ marginLeft: '5px' }} href="/suggestion">
					Suggestions
				</a>
				<a style={{ marginLeft: '5px' }} href="/bookings">
					Scheduled bookings
				</a>

				<AdminLinks />

				<LoginStatus />
			</nav>
		</header>
	);
};

const ProtectedLinks = () => {
	const { data, isLoading } = useUser();

	if (isLoading) return null;

	if (!data) return null;

	return (
		<>
			<a style={{ marginLeft: '5px' }} href="/add">
				Add
			</a>
			<a style={{ marginLeft: '5px' }} href="/addplatform">
				Add platform
			</a>
			<a style={{ marginLeft: '5px' }} href="/borrowlist">
				Borrow requests
			</a>
			<a style={{ marginLeft: '5px' }} href="/addsuggestion">
				Add Suggestion
			</a>
		</>
	);
};

const AdminLinks = () => {
	const { data, isLoading } = useUser();

	useEffect(() => {
		console.log(data);
	}, [data]);

	if (isLoading) return null;

	if (!data || !data.isSiteAdmin) return null;

	return (
		<a style={{ marginLeft: '5px' }} href="/admin">
			Admin
		</a>
	);
};

export default Header;
