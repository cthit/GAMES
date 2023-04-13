import { FC } from 'react';
import styles from './GameCard.module.css';

interface GameCardProps {
	name: string;
	description: string;
	platform: string;
	playtime: string;
	release_date: string;
}

const GameCard: FC<GameCardProps> = ({
	name,
	description,
	platform,
	release_date,
	playtime
}) => {
	return (
		<li className={styles.card}>
			<h2>{name}</h2>
			<p>{description}</p>
			<p>Platform: {platform}</p>
			<p>Playtime: {playtime} mins</p>
			<p>Release date: {release_date}</p>
		</li>
	);
};

export default GameCard;
