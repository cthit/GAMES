import { useUser } from '@/src/hooks/api/auth';
import { useAddRating } from '@/src/hooks/api/useAddRating';
import StarIcon from '@/src/icons/Star';
import { FC, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../../Forms/Button/Button';
import styles from './GameRatings.module.scss';

interface GameRatingsProps {
	gameId: string;
	userRating: number | null;
}

const GameRatings: FC<GameRatingsProps> = ({ gameId, userRating }) => {
	const { data } = useUser();

	const [starCount, setStarCount] = useState<number | null>(userRating);
	const { mutateAsync, isLoading } = useAddRating();

	const handleRateGame = () => {
		if (!starCount)
			return toast.error("You haven't selected a rating!", {
				position: 'bottom-right'
			});

		toast.promise(
			mutateAsync({ game: gameId, rating: starCount }),
			{
				pending: 'Rating game...',
				success: 'Rated game!',
				error: 'Could not rate game!'
			},
			{
				position: 'bottom-right'
			}
		);
	};

	if (!data) return null;

	return (
		<div className={styles.layout}>
			<StarPicker
				starCount={starCount}
				setStarCount={setStarCount}
				maxStars={5}
			/>
			<Button label="Rate game" onClick={handleRateGame} disabled={isLoading} />
		</div>
	);
};

interface StarPickerProps {
	starCount: number | null;
	setStarCount: (nr: number) => void;
	maxStars: number;
}

const StarPicker: FC<StarPickerProps> = ({
	starCount,
	setStarCount,
	maxStars
}) => {
	const stars = useMemo(
		() => Array.from({ length: maxStars }, (_, i) => i + 1),
		[maxStars]
	);

	const nrStars = starCount ? starCount : maxStars + 1;

	return (
		<div className={styles.starContainer}>
			{/* 
                The inverted logic, nr >= starCount is because of the hover CSS, which requires
                the order to be in reverse.
            */}
			{stars.map((nr) => (
				<StarIcon
					key={nr}
					className={`${styles.star} ${nr >= nrStars ? styles.selected : ''}`}
					onClick={() => setStarCount(nr)}
				/>
			))}
		</div>
	);
};

export default GameRatings;
