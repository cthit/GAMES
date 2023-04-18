import { useApiGet } from '@/src/hooks/apiHooks';
import { ChangeEvent, FC } from 'react';
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
}

const GamesList: FC<GamesListProps> = () => {
	const { data, error, loading } = useApiGet<Game[]>('/games');

	const search = debounce((e: ChangeEvent) => {
		console.log(e.target.value)
		// TODO: send a search request to the backend and update data
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
						/>
					))}
				</ul>
			) : null}
		</div>
	);
};

export default GamesList;
