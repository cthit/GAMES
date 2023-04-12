import { FC } from 'react';
import styles from './GameCard.module.css';

interface GameCardProps {
	name: string;
	description: string;
}

const GameCard: FC<GameCardProps> = ({ name, description }) => {
	return (
		<li className={styles.card}>
			<h2>{name}</h2>
			<p>{description}</p>
		</li>
	);
};

export default GameCard;
