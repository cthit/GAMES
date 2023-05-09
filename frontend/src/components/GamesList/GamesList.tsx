import { usePublicGames } from '@/src/hooks/api/usePublicGames';
import debounce from 'lodash.debounce';
import { ChangeEvent, FC, useState } from 'react';
import GameCard from '../GameCard/GameCard';
import GameFilter from '../GameFilter/GameFilter';
import styles from './GamesList.module.css';

interface GamesListProps {}

type SearchFilter = {
	search?: string;
	platform?: string;
	releaseBefore?: Date;
	releaseAfter?: Date;
	playtimeMax?: number;
	playtimeMin?: number;
	playerCount?: number;
	location?: string;
	owner?: string;
};

const GamesList: FC<GamesListProps> = () => {
	const [platform, setPlatform] = useState('');
	const [releaseBefore, setReleaseBefore] = useState<Date>();
	const [releaseAfter, setReleaseAfter] = useState<Date>();
	const [playtimeMax, setPlaytimeMax] = useState<number>();
	const [playtimeMin, setPlaytimeMin] = useState<number>();
	const [playerCount, setPlayerCount] = useState<number>();
	const [owner, setOwner] = useState<string>();
	const searchFilter: SearchFilter = {};
	const { data, error, isLoading } = usePublicGames();

	const search = debounce((e: ChangeEvent<HTMLInputElement>) => {
		if (platform) searchFilter.platform = platform;
		if (releaseBefore) searchFilter.releaseBefore = new Date(releaseBefore);
		if (releaseAfter) searchFilter.releaseAfter = new Date(releaseAfter);
		if (playtimeMax) searchFilter.playtimeMax = playtimeMax;
		if (playtimeMin) searchFilter.playtimeMin = playtimeMin;
		if (playerCount) searchFilter.playerCount = playerCount;
		if (owner) searchFilter.owner = owner;
	}, 300);

	return (
		<>
			<GameFilter
				setPlatform={setPlatform}
				setReleaseBefore={setReleaseBefore}
				setReleaseAfter={setReleaseAfter}
				setPlaytimeMax={setPlaytimeMax}
				setPlaytimeMin={setPlaytimeMin}
				setPlayerCount={setPlayerCount}
				setOwner={setOwner}
				platform={platform}
				releaseAfter={releaseAfter}
				releaseBefore={releaseBefore}
				playtimeMax={playtimeMax}
				playtimeMin={playtimeMin}
				playerCount={playerCount}
				owner={owner}
				filterFunction={search}
			/>
			<div style={{ width: 'auto' }}>
				<input
					className={styles.gamesListSearchBar}
					type="text"
					placeholder="Search for a game"
					onChange={search}
					onLoad={search}
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

export default GamesList;
