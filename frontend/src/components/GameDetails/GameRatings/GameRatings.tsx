import { useUser } from '@/src/hooks/api/auth';
import StarIcon from '@/src/icons/Star';
import { FC, useMemo, useState } from 'react';
import Button from '../../Forms/Button/Button';
import styles from './GameRatings.module.scss';

interface GameRatingsProps {
	gameId: string;
}

const GameRatings: FC<GameRatingsProps> = ({ gameId }) => {
	const { data } = useUser();

	const [starCount, setStarCount] = useState(0);

	if (!data) return null;

	return (
		<div className={styles.layout}>
			<StarPicker
				starCount={starCount}
				setStarCount={setStarCount}
				maxStars={5}
			/>
			<Button label="Rate game" />
		</div>
	);
};

interface StarPickerProps {
	starCount: number;
	setStarCount: (nr: number) => void;
	maxStars: number;
}

const StarPicker: FC<StarPickerProps> = ({
	starCount,
	setStarCount,
	maxStars
}) => {
	const stars = useMemo(() => {
		return Array.from({ length: 5 }, (_, i) => i + 1);
	}, [maxStars]);

	return (
		<div className={styles.starContainer}>
			{/* 
                The inverted logic, nr >= starCount is because of the hover CSS, which requires
                the order to be in reverse.
            */}
			{stars.map((nr) => (
				<StarIcon
					key={nr}
					className={`${styles.star} ${nr >= starCount ? styles.selected : ''}`}
					onClick={() => setStarCount(nr)}
				/>
			))}
		</div>
	);
};

export default GameRatings;
