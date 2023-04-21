import { FC } from 'react';
import styles from './GameCard.module.css';
import { useApiPost } from '@/src/hooks/apiHooks';

interface GameCardProps {
	name: string;
	description: string;
	platform: string;
	playtimeMinutes: string;
	releaseDate: string;
	borrowed: boolean;
	gameId: string;
}

const GameCard: FC<GameCardProps> = ({
	name,
	description,
	platform,
	releaseDate,
	playtimeMinutes,
	borrowed,
	gameId
}) => {
	return (
		<li className={styles.card}>
			<h2>{name}</h2>
			<p>{description}</p>
			<p>Platform: {platform}</p>
			<p>Playtime: {playtimeMinutes} mins</p>
			<p>Release date: {releaseDate}</p>
			<button
			/* onClick={() => {
					const {
						error: borrowError,
						loading: borrowLoading,
						!borrowed
					} = useApiPost('/game/borrow');
				}}*/
			>
				{borrowed ? 'Currently borrowed' : 'In stock'}
			</button>
		</li>
	);
};

export default GameCard;
