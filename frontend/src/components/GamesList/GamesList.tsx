import { usePublicGames } from '@/src/hooks/api/usePublicGames';
import { FC, useState } from 'react';
import GameCard from '../GameCard/GameCard';
import GameFilter from '../GameFilter/GameFilter';
import styles from './GamesList.module.css';

interface GamesListProps {}

const GamesList: FC<GamesListProps> = () => {
	const [search, setSearch] = useState('');
	const filter = useFilter();
	const { data, error, isLoading } = usePublicGames(search, filter.full);

	return (
		<>
			<GameFilter
				setPlatform={filter.setPlatform}
				setReleaseBefore={filter.setReleaseBefore}
				setReleaseAfter={filter.setReleaseAfter}
				setPlaytimeMax={filter.setPlaytimeMax}
				setPlaytimeMin={filter.setPlaytimeMin}
				setPlayerCount={filter.setPlayerCount}
				setOwner={filter.setOwner}
				platform={filter.full.platform}
				releaseAfter={filter.full.releaseAfter}
				releaseBefore={filter.full.releaseBefore}
				playtimeMax={filter.full.playtimeMax}
				playtimeMin={filter.full.playtimeMin}
				playerCount={filter.full.playerCount}
				owner={filter.full.owner}
			/>
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
							<GameCard
								key={game.id}
								id={game.id}
								name={game.name}
								description={game.description}
								platform={game.platformName}
								playtimeMinutes={game.playtimeMinutes}
								releaseDate={game.releaseDate}
								isBorrowed={game.isBorrowed}
								playerMin={game.playerMin}
								playerMax={game.playerMax}
								location={game.location}
								owner={game.owner}
								ratingAvg={game.ratingAvg}
								ratingUser={game.ratingUser}
								isPlayed={game.isPlayed}
							/>
						))}
					</ul>
				) : null}
			</div>
		</>
	);
};

const useFilter = () => {
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
