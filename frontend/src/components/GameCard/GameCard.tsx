import { useUser } from '@/src/hooks/api/auth';
import { Game, useGameRemover } from '@/src/hooks/api/games';
import { useAddRating } from '@/src/hooks/api/useAddRating';
import { useMarkAsPlayed } from '@/src/hooks/api/useMarkAsPlayed';
import { FC, useState } from 'react';
import Select from '../Forms/Select/Select';
import styles from './GameCard.module.css';

interface GameCardProps {
	game: Game;
}

const GameCard: FC<GameCardProps> = ({ game }) => {
	return (
		<li className={styles.card}>
			<h2>{game.name}</h2>
			<p>{game.description}</p>
			<p>Platform: {game.platformName}</p>
			<p>Playtime: {game.playtimeMinutes} mins</p>
			<p>Release date: {game.releaseDate}</p>
			<p>
				Status:
				{game.isBorrowed ? 'Currently borrowed' : 'Currently Available'}
			</p>
			<p>Minimum players: {game.playerMin}</p>
			<p>Maximum players: {game.playerMax}</p>
			<p>Location: {game.location}</p>
			<p>Owner: {game.owner}</p>

			<PlayStatus game={game} />

			<GameRating game={game} />

			<BorrowGame game={game} />
			<RemoveGame game={game} />
		</li>
	);
};

const GameRating: FC<GameCardProps> = ({ game }) => {
	const [rating, setRating] = useState<string>(game.ratingUser);
	const { mutate } = useAddRating();
	const { data } = useUser();

	if (!data) return <p>Average rating: {game.ratingAvg}</p>;

	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					if (!rating) return;
					mutate({
						game: game.id,
						rating: parseInt(rating)
					});
				}}
			>
				<Select
					label="Rating"
					options={['1', '2', '3', '4', '5']}
					placeholder="Select a level"
					onChange={(select) => setRating(select.target.value)}
					value={rating || ''}
				/>
				<br />
				<input type="submit" value="Rate" />
			</form>
			<p>Average rating: {game.ratingAvg}</p>
		</>
	);
};

const RemoveGame: FC<GameCardProps> = ({ game }) => {
	const { data } = useUser();
	const { mutate } = useGameRemover();

	if (!data) return null;

	return (
		<input
			type="button"
			value="Remove Game"
			onClick={async () => mutate(game.id)}
		/>
	);
};

const BorrowGame: FC<GameCardProps> = ({ game }) => {
	const data = useUser();

	if (!data) return null;

	return (
		<form action="/borrow">
			<input type="hidden" id="game" name="game" value={game.id} />
			<input type="submit" value="Borrow Game" />
		</form>
	);
};

const PlayStatus: FC<GameCardProps> = ({ game }) => {
	const { mutate: markAsPlayed } = useMarkAsPlayed();
	const { data } = useUser();

	if (!data) return null;

	return (
		<p>
			Game is currently: {game.isPlayed ? 'played' : `not played`}
			<input
				type="button"
				value="Mark as played"
				onClick={() => {
					markAsPlayed({ gameId: game.id });
				}}
			/>
		</p>
	);
};

export default GameCard;
