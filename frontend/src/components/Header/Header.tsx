import { FC } from 'react';
import styles from './Header.module.css';

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
			</nav>
		</header>
	);
};

export default Header;
