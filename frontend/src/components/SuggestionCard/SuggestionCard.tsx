import ClockProps from '@/src/icons/Clock';
import PersonIcon from '@/src/icons/Person';
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
			<img
				className={styles.image}
				src="/images/game-default.png"
				alt="Game image"
			/>
			<div className={styles.propBox}>
				<h4 className={styles.title}>{name}</h4>
				<div className={styles.propRow}>
					<div className={styles.iconRow}>
						<IconWithText
							icon={PersonIcon}
							text={
								playerMin == playerMax ? playerMin : `${playerMin}-${playerMax}`
							}
						/>
						<IconWithText icon={ClockProps} text={`${playtimeMinutes} min`} />
					</div>
					<p>{platform}</p>
				</div>
				<p>{motivation}</p>
			</div>
		</li>
	);
};

interface IconWithTextProps {
	icon: FC<{ className?: string }>;
	text: string;
}

const IconWithText: FC<IconWithTextProps> = ({ icon: Icon, text }) => {
	return (
		<div className={styles.iconWithText}>
			<Icon className={styles.icon} />
			<span>{text}</span>
		</div>
	);
};

export default SuggestionCard;
