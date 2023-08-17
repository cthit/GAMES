import { useUser } from '@/src/hooks/api/auth';
import { useAddRating } from '@/src/hooks/api/useAddRating';
import StarIcon from '@/src/icons/Star';
import { FC, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../../Forms/Button/Button';
import styles from './GameRatings.module.scss';
import TextArea from '../../Forms/TextArea/TextArea';
import { Rating } from '@/src/hooks/api/useGameRatings';
import { useApiGet } from '@/src/hooks/apiHooks';

interface GameRatingsProps {
	gameId: string;
	userRating: number | null;
	userMotivation?: string
}

const GameRatings: FC<GameRatingsProps> = ({ gameId, userRating, userMotivation }) => {
	const { data } = useUser();

	const [starCount, setStarCount] = useState<number | null>(userRating);
	const [motivation, setMotivation] = useState<string | undefined>(userMotivation)
	const { mutateAsync, isLoading } = useAddRating();

	const handleRateGame = () => {
		if (!starCount)
			return toast.error("You haven't selected a rating!", {
				position: 'bottom-right'
			});

		toast.promise(
			mutateAsync({ game: gameId, rating: starCount, motivation: motivation }),
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
			<Ratings gameId={gameId} />
			<div className={styles.rateLayout}>
			<StarPicker
				starCount={starCount}
				setStarCount={setStarCount}
				maxStars={5}
			/>
				<TextArea onChange={(e) => { setMotivation(e.target.value) }} label={'Motivate your rating'} />
			<Button label="Rate game" onClick={handleRateGame} disabled={isLoading} />
		</div>
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
		// Reverses for CSS to work
		() => Array.from({ length: maxStars }, (_, i) => i + 1).reverse(),
		[maxStars]
	);

	const nrStars = starCount ? starCount : maxStars + 1;

	return (
		<div className={styles.starContainer}>
			{stars.map((nr) => (
				<StarIcon
					key={nr}
					className={`${styles.star} ${nr <= nrStars ? styles.selected : ''}`}
					onClick={() => setStarCount(nr)}
				/>
			))}
		</div>
	);
};

const Ratings = ({ gameId }: GameRatingsProps) => {
	const { data, loading, error } = useApiGet("/rating/game/" + gameId);

	if (loading) return <p>Loading...</p>;

	if (error) return <p>Error: {error}</p>;

	if (!data) return <p>No game found</p>;
	console.log(data)
	return (
		<div className={styles.ratings}>
			{data.map((rating: Rating) => (
				<RatingCard rating={rating} />
			))}

		</div >
	)
}

const RatingCard = ({ rating }: { rating: Rating }) => {
	const maxStars = 5
	const stars = useMemo(
		() => Array.from({ length: maxStars }, (_, i) => i + 1),
		[5])
	const nrStars = rating.rating ? rating.rating : maxStars + 1;

	return (
		<div className={styles.ratingCard}>
			{stars.map((nr) => (
				<StarIcon
					key={nr}
					className={`${styles.star} ${nr <= nrStars ? styles.selected : ''}`}
				/>
			))}
			<p>{rating.motivation}</p>
		</div>
	)
}
export default GameRatings;
