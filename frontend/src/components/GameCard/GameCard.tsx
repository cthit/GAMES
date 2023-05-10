import { Game } from '@/src/hooks/api/usePublicGames';
import { useApiPost } from '@/src/hooks/apiHooks';
import { FC, useState } from 'react';
import Select from '../Forms/Select/Select';
import RemoveGame from '../RemoveGame/RemoveGame';
import styles from './GameCard.module.css';

interface Rating {
	rating: number;
}

interface GameCardProps {
	game: Game;
}

const GameCard: FC<GameCardProps> = ({ game }) => {
	const [rating, setRating] = useState<string>(game.ratingUser);

	const { postData: ratePostData } = useApiPost('/rating/rate');

	const { postData } = useApiPost('/games/markPlayed');

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
			<p>
				Game is currently: {game.isPlayed ? 'played' : `not played`}
				<input
					type="button"
					value="Mark as played"
					onClick={() => {
						postData({ gameId: game.id });
					}}
				/>
			</p>
			<form action="/borrow">
				<input type="hidden" id="game" name="game" value={game.id} />
				<input type="submit" value="Borrow Game" />
			</form>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					if (!rating) return;
					ratePostData({
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
			<RemoveGame id={game.id} />
		</li>
	);
};

export default GameCard;
