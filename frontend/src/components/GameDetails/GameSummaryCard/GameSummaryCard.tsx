import { useUser } from '@/src/hooks/api/auth';
import { useChangePlayStatus } from '@/src/hooks/api/useChangePlayStatus';
import { FC } from 'react';
import { toast } from 'react-toastify';
import Button from '../../Forms/Button/Button';
import styles from './GameSummaryCard.module.scss';

interface GameSummaryCardProps {
	name: string;
	description: string;
	imgUrl: string;
	gameId: string;
	played: boolean;
}

const GameSummaryCard: FC<GameSummaryCardProps> = ({
	name,
	description,
	imgUrl,
	gameId,
	played
}) => {
	return (
		<div className={styles.card}>
			<img className={styles.picture} src={imgUrl} alt={`${name}'s cover`} />
			<div className={styles.textContainer}>
				<p className={styles.name}>{name}</p>
				<p className={styles.description}>{description}</p>
			</div>
			<MarkAsPlayed gameId={gameId} played={played} />
		</div>
	);
};

const MarkAsPlayed = ({
	gameId,
	played
}: {
	gameId: string;
	played: boolean;
}) => {
	const { data } = useUser();
	const { mutateAsync, isLoading } = useChangePlayStatus();

	const handleMarkAsPlayed = () => {
		toast.promise(
			mutateAsync({ gameId, played }),
			{
				pending: 'Updating play status...',
				success: 'Updated play status!',
				error: 'Could not update game play status!'
			},
			{
				position: 'bottom-right'
			}
		);
	};

	if (!data) return null;

	return (
		<Button
			label={played ? 'Mark as unplayed' : 'Mark as played'}
			onClick={handleMarkAsPlayed}
			disabled={isLoading}
		/>
	);
};

export default GameSummaryCard;
