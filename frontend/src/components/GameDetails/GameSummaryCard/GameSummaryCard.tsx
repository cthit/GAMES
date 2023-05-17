import { FC } from 'react';
import styles from './GameSummaryCard.module.scss';

interface GameSummaryCardProps {
	name: string;
	description: string;
	imgUrl: string;
}

const GameSummaryCard: FC<GameSummaryCardProps> = ({
	name,
	description,
	imgUrl
}) => {
	return (
		<div className={styles.card}>
			<img className={styles.picture} src={imgUrl} alt={`${name}'s cover`} />
			<div className={styles.textContainer}>
				<p className={styles.name}>{name}</p>
				<p className={styles.description}>{description}</p>
			</div>
		</div>
	);
};

export default GameSummaryCard;
