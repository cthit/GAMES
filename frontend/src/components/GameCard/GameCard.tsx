import { FC, useState } from 'react';
import RemoveGame from '../RemoveGame/RemoveGame';
import styles from './GameCard.module.css';
import Select from '../Forms/Select/Select';
import { useApiPost } from '@/src/hooks/apiHooks';

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
	owner: string;
	ratingAvg: string;
	ratingUser: string;
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
	owner,
	ratingAvg,
	ratingUser
}) => {

	const [rating, setRating] = useState<string>(ratingUser);

	const {
		error: postError,
		loading: postLoading,
		postData
	} = useApiPost('/rating/rate');

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
			<p>Owner: {owner}</p>
			<form action="/borrow">
				<input type="hidden" id="game" name="game" value={id} />
				<input type="submit" value="Borrow Game" />
			</form>
			<form onSubmit={(e) => {
				e.preventDefault();
				if (!rating) return;
				postData({
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
