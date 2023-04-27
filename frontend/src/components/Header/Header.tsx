import { FC } from 'react';
import styles from './Header.module.css';
import LoginStatus from '@/src/components/LoginStatus/LoginStatus';

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {



	return (
		<header className={styles.header}>
			<h1>Extremely Ugly GAMES Header</h1>
			<nav>
				<a href="/">Home</a>
				<a style={{ marginLeft: '5px' }} href="/add">
					Add
				</a>
				<a style={{ marginLeft: '5px' }} href="/addplatform">Add platform</a>

				<a style={{ marginLeft: '5px' }} href="/addsuggestion">
					Add Suggestion
				</a>
				<a style={{ marginLeft: '5px' }} href="/suggestion">
					Suggestions
				</a>
				<a style={{ marginLeft: '5px' }} href="/bookings">
					Scheduled bookings
				</a>
        
        <LoginStatus />

			</nav>
		</header>
	);
};

export default Header;
