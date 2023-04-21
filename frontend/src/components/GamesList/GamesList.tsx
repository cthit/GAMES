import { useApiGet } from '@/src/hooks/apiHooks';
import { ChangeEvent, FC, useState } from 'react';
import GameCard from '../GameCard/GameCard';
import styles from './GamesList.module.css';
import debounce from 'lodash.debounce';

interface GamesListProps {}

interface Game {
	id: string;
	name: string;
	description: string;
	platformName: string;
	playtimeMinutes: string;
	releaseDate: string;
	isBorrowed: boolean;
	playerMin: string;
	playerMax: string;
}

const GamesList: FC<GamesListProps> = () => {
	const [apiPath, setApiPath] = useState("/games")
	const [isSearching, setIsSearching] = useState(false)
	const { data, error, loading } = useApiGet<Game[]>(apiPath);

	const search = debounce((e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value) {
			setApiPath("/games/search?term=" + e.target.value)
			setIsSearching(true)
		} else {
			setApiPath("/games")
			setIsSearching(false)
		}
	}, 300)

	return (
		<div style={{width: 'auto'}}>
			<input 
				className={styles.gamesListSearchBar} 
				type='text'
				placeholder='Search for a game'
				onChange={search}
			/>

			{loading ? <p>Loading...</p> : null}

			{error ? <p>Error: {error}</p> : null}

			{data?.length == 0 && isSearching ? <p>No games matching your search</p> : null}

			{data ? (
				<ul className={styles.gamesList}>
					{data.map((game) => (
						<GameCard
							key={game.id}
							name={game.name}
							description={game.description}
							platform={game.platformName}
							playtimeMinutes={game.playtimeMinutes}
							releaseDate={game.releaseDate}
							isBorrowed={game.isBorrowed}
							playerMin={game.playerMin}
							playerMax={game.playerMax}
						/>
					))}
				</ul>
			) : null}
		</div>
	);
};

export default GamesList;
