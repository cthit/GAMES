import { useUser } from '@/src/hooks/api/auth';
import { Game } from '@/src/hooks/api/games';
import { useAddRating } from '@/src/hooks/api/useAddRating';
import ClockIcon from '@/src/icons/Clock';
import PersonIcon from '@/src/icons/Person';
import Link from 'next/link';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './GameCard.module.scss';

interface GameCardProps {
	game: Game;
}

const GameCard: FC<GameCardProps> = ({ game }) => {
	return (
		<Link href={`/game/${game.id}`} legacyBehavior>
			<li className={styles.card}>
				<img
					className={styles.gameImage}
					src="/images/game-default.png"
					alt="Game cover"
				/>

				<h2>{game.name}</h2>

				<GameRating game={game} />

				<div className={styles.gameProps}>
					<div className={styles.leftProps}>
						<IconWithText
							icon={PersonIcon}
							text={
								game.playerMin == game.playerMax
									? `${game.playerMin}`
									: `${game.playerMin}-${game.playerMax}`
							}
						/>

						<IconWithText
							icon={ClockIcon}
							text={`${game.playtimeMinutes} min`}
						/>
					</div>

					<p style={{ fontWeight: 'bold' }}>{game.platformName}</p>
				</div>
			</li>
		</Link>
	);
};

const GameRating: FC<GameCardProps> = ({ game }) => {
	const [ratingWidth, setRatingWidth] = useState(0);
	const ref = useRef<HTMLSpanElement>(null);

	const { mutate } = useAddRating();
	const { data } = useUser();

	useEffect(() => {
		if (!ref.current || !game.ratingAvg) return;

		const starWidth = ref.current.offsetWidth;
		const rating = game.ratingAvg / 5;

		setRatingWidth(starWidth * rating);
	}, [ref, game.ratingAvg]);

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

interface IconWithTextProps {
	icon: FC<{ className?: string }>;
	text: string;
}

const IconWithText: FC<IconWithTextProps> = ({ icon: Icon, text }) => {
	return (
		<div className={styles.gameProp}>
			{<Icon className={styles.icon} />}
			<p className={styles.propText}>{text}</p>
		</div>
	);
};

export default GameCard;
