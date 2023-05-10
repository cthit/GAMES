import { useApiPost } from '@/src/hooks/apiHooks';
import debounce from 'lodash.debounce';
import { ChangeEvent, FC, useState } from 'react';
import GameCard from '../GameCard/GameCard';
import GameFilter from '../GameFilter/GameFilter';
import styles from './GamesList.module.css';

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
	location: string;
	owner: string;
	ratingAvg: string;
	ratingUser: string;
	isPlayed: boolean;
}
type SearchFilter = {
	name?: string;
	platform?: string;
	releaseBefore?: Date;
	releaseAfter?: Date;
	playtimeMax?: number;
	playtimeMin?: number;
	playerCount?: number;
	location?: string;
	owner?: string;
	isPlayed?: boolean;
};

const GamesList: FC<GamesListProps> = () => {
	const apiPath = '/games/filter';
	const [isSearching, setIsSearching] = useState(false);
	const { postData, error, loading, data } = useApiPost<Game[]>(apiPath);
	const [platform, setPlatform] = useState('');
	const [releaseBefore, setReleaseBefore] = useState<Date>();
	const [releaseAfter, setReleaseAfter] = useState<Date>();
	const [playtimeMax, setPlaytimeMax] = useState<number>();
	const [playtimeMin, setPlaytimeMin] = useState<number>();
	const [playerCount, setPlayerCount] = useState<number>();
	const [owner, setOwner] = useState<string>();
	const [isPlayed, setIsPlayed] = useState<boolean>();
	const searchFilter: SearchFilter = {};

	const search = debounce((e: ChangeEvent<HTMLInputElement>) => {
		setIsSearching(true);
		if (e !== undefined) {
			if (e.target.value) searchFilter.name = e.target.value;
		}
		if (platform) searchFilter.platform = platform;
		if (releaseBefore) searchFilter.releaseBefore = new Date(releaseBefore);
		if (releaseAfter) searchFilter.releaseAfter = new Date(releaseAfter);
		if (playtimeMax) searchFilter.playtimeMax = playtimeMax;
		if (playtimeMin) searchFilter.playtimeMin = playtimeMin;
		if (playerCount) searchFilter.playerCount = playerCount;
		if (owner) searchFilter.owner = owner;
		if (isPlayed != undefined) searchFilter.isPlayed = isPlayed;
		postData(searchFilter);
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
				setIsPlayed={setIsPlayed}
				platform={platform}
				releaseAfter={releaseAfter}
				releaseBefore={releaseBefore}
				playtimeMax={playtimeMax}
				playtimeMin={playtimeMin}
				playerCount={playerCount}
				owner={owner}
				isPlayed={isPlayed}
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

				{loading ? <p>Loading...</p> : null}

				{error ? <p>Error: {error}</p> : null}

				{postData?.length == 0 && isSearching ? (
					<p>No games matching your search</p>
				) : null}

				{data ? (
					<ul className={styles.gamesList}>
						{data.map((game: Game) => (
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
