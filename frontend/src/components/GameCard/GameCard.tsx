import { FC } from 'react';
import styles from './GameCard.module.css';
import { useApiPost } from '@/src/hooks/apiHooks';

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
	playerMax
}) => {
	console.log(id);
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
			<form action="/borrow">
				<input type="hidden" id="game" name="game" value={id} />
				<input type="submit" value="Borrow Game" />
			</form>
		</li>
	);
};

export default GameCard;
