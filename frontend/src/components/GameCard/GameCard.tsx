import { FC } from 'react';
import styles from './GameCard.module.css';

interface GameCardProps {
	name: string;
	description: string;
	platform: string;
}

const GameCard: FC<GameCardProps> = ({ name, description, platform }) => {
	return (
		<li className={styles.card}>
			<h2>{name}</h2>
			<p>{description}</p>
			<p>Platform: {platform}</p>
		</li>
	);
};

export default GameCard;
