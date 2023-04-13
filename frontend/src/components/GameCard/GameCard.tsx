import { FC } from 'react';
import styles from './GameCard.module.css';

interface GameCardProps {
	name: string;
	description: string;
	platform: string;
	playtime: string;
}

const GameCard: FC<GameCardProps> = ({
	name,
	description,
	platform,
	playtime
}) => {
	return (
		<li className={styles.card}>
			<h2>{name}</h2>
			<p>{description}</p>
			<p>Platform: {platform}</p>
			<p>{playtime} minutes</p>
		</li>
	);
};

export default GameCard;
