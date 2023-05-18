import { FC } from 'react';
import styles from './SuggestionCard.module.scss';

interface SuggestionCardProps {
	name: string;
	platform: string;
	playtimeMinutes: string;
	playerMin: string;
	playerMax: string;
	motivation: string;
}

const SuggestionCard: FC<SuggestionCardProps> = ({
	name,
	platform,
	playtimeMinutes,
	playerMin,
	playerMax,
	motivation
}) => {
	return (
		<li className={styles.card}>
			<h2>{name}</h2>
			<p>Platform: {platform}</p>
			<p>Playtime: {playtimeMinutes} mins</p>
			<p>Minimum players: {playerMin}</p>
			<p>Maximum players: {playerMax}</p>
			<p>{motivation}</p>
		</li>
	);
};

export default SuggestionCard;
