import { FC, useState } from 'react';
import { useApiPost } from '@/src/hooks/apiHooks';
import RemoveGame from '../RemoveGame/RemoveGame';
import styles from './GameCard.module.css';
import Select from '../Forms/Select/Select';

interface Rating {
	rating: number;
}

interface GameCardProps {
	id: string;
	name: string;
	description: string;
	platform: string;
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

const GameCard: FC<GameCardProps> = ({
	id,
	name,
	description,
	platform,
	releaseDate,
	playtimeMinutes,
	isBorrowed,
	playerMin,
	playerMax,
  location,
	owner,
	isPlayed,
	ratingAvg,
	ratingUser
}) => {

	const [rating, setRating] = useState<string>(ratingUser);

	const {
		error: postError,
		loading: postLoading,
		postData: ratePostData
	} = useApiPost('/rating/rate');

	const { postData } = useApiPost('/games/markPlayed');
  
	return (
		<li className={styles.card}>
			<h2>{name}</h2>
			<p>{description}</p>
			<p>Platform: {platform}</p>
			<p>Playtime: {playtimeMinutes} mins</p>
			<p>Release date: {releaseDate}</p>
			<p>
				Status:
				{isBorrowed ? 'Currently borrowed' : 'Currently Available'}
			</p>
			<p>Minimum players: {playerMin}</p>
			<p>Maximum players: {playerMax}</p>
			<p>Location: {location}</p>
			<p>Owner: {owner}</p>
			<p>
				Game is currently: {isPlayed ? 'played' : `not played`}
				<input
					type="button"
					value="Mark as played"
					onClick={() => {
						postData({ gameId: id });
					}}
				/>
			</p>
			<form action="/borrow">
				<input type="hidden" id="game" name="game" value={id} />
				<input type="submit" value="Borrow Game" />
			</form>
			<form onSubmit={(e) => {
				e.preventDefault();
				if (!rating) return;
				ratePostData({
					game: id,
					rating: parseInt(rating)
				});
			}}>
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
			<p>Average rating: {ratingAvg}</p>
			<RemoveGame id={id} />
		</li>
	);
};

export default GameCard;
