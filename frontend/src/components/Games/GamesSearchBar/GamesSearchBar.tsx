import LookingGlassIcon from '@/src/icons/LookingGlass';
import { FC } from 'react';
import styles from './GamesSearchBar.module.scss';

interface GamesSearchBarProps {
	searchValue: string;
	setSearch: (value: string) => void;
}

const GamesSearchBar: FC<GamesSearchBarProps> = ({
	searchValue,
	setSearch
}) => {
	return (
		<div className={styles.searchDiv}>
			<input
				className={styles.searchBar}
				type="text"
				placeholder="Type to search..."
				onChange={(e) => setSearch(e.target.value)}
				value={searchValue}
			/>
			<LookingGlassIcon className={styles.searchIcon} />
		</div>
	);
};

export default GamesSearchBar;
