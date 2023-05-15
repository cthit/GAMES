import { usePublicGames } from '@/src/hooks/api/games';
import { FC, useState } from 'react';
import GameCard from '../GameCard/GameCard';
import GameFilter from '../GameFilter/GameFilter';
import styles from './GamesList.module.scss';

interface GamesListProps {}

const GamesList: FC<GamesListProps> = () => {
	const [search, setSearch] = useState('');
	const filter = useFilterState();
	const { data, error, isLoading } = usePublicGames(search, filter.full);

	return (
		<>
			<GameFilter filterState={filter} />
			<div style={{ width: 'auto' }}>
				<input
					className={styles.gamesListSearchBar}
					type="text"
					placeholder="Search for a game"
					onChange={(e) => setSearch(e.target.value)}
					value={search}
				/>

				{isLoading ? <p>Loading...</p> : null}

				{error ? <p>Error: {error.message}</p> : null}

				{data ? (
					<ul className={styles.gamesList}>
						{data.map((game) => (
							<GameCard key={game.id} game={game} />
						))}
					</ul>
				) : null}
			</div>
		</>
	);
};

export const useFilterState = () => {
	// This hook is an example of why sometimes you want to pass state up.
	const [platform, setPlatform] = useState<string>();
	const [releaseBefore, setReleaseBefore] = useState<Date>();
	const [releaseAfter, setReleaseAfter] = useState<Date>();
	const [playtimeMax, setPlaytimeMax] = useState<number>();
	const [playtimeMin, setPlaytimeMin] = useState<number>();
	const [playerCount, setPlayerCount] = useState<number>();
	const [owner, setOwner] = useState<string>();

	return {
		full: {
			platform,
			releaseBefore,
			releaseAfter,
			playtimeMax,
			playtimeMin,
			playerCount,
			owner
		},
		setPlatform,
		setReleaseBefore,
		setReleaseAfter,
		setPlaytimeMax,
		setPlaytimeMin,
		setPlayerCount,
		setOwner
	};
};

export default GamesList;
