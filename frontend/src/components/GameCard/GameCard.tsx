import { Game } from '@/src/hooks/api/games';
import ClockIcon from '@/src/icons/Clock';
import PersonIcon from '@/src/icons/Person';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './GameCard.module.scss';

interface GameCardProps {
	game: Game;
}

const GameCard: FC<GameCardProps> = ({ game }) => {
	return (
		<li className={styles.card}>
			<h2>{game.name}</h2>

			<GameRating game={game} />

			<div className={styles.gameProps}>
				<div className={styles.leftProps}>
					<div className={styles.gameProp}>
						<PersonIcon className={styles.icon} />
						<p className={styles.propText}>
							{game.playerMin == game.playerMax
								? game.playerMax
								: `${game.playerMin}-${game.playerMax}`}
						</p>
					</div>

					<ClockIcon className={styles.icon} />
					<p className={styles.propText}>{game.playtimeMinutes} min</p>
				</div>

				<p style={{ fontWeight: 'bold' }}>{game.platformName}</p>
			</div>
		</li>
	);
};

const GameRating: FC<GameCardProps> = ({ game }) => {
	const [ratingWidth, setRatingWidth] = useState(0);
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (!ref.current) return;
		const starWidth = ref.current.offsetWidth;
		const rating = game.ratingAvg / 5;
		setRatingWidth(starWidth * rating);
	}, [ref]);

	if (!game.ratingAvg) return <p>Not yet rated.</p>;

	return (
		<>
			<div className={styles.starRatings} style={{ width: `${ratingWidth}px` }}>
				<div
					className={styles.fillRatings}
					style={{ width: `${ratingWidth}px` }}
				>
					<span ref={ref}>★★★★★</span>
				</div>
				<div className={styles.emptyRatings}>
					<span>★★★★★</span>
				</div>
			</div>
		</>
	);
};

export default GameCard;
