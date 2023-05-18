import { useUser } from '@/src/hooks/api/auth';
import { useGameOwner, useGameRemover } from '@/src/hooks/api/games';
import { useChangePlayStatus } from '@/src/hooks/api/useChangePlayStatus';
import TrashCanIcon from '@/src/icons/TrashCan';
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
			<RemoveGame gameId={gameId} />
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
			label={played ? 'Mark game as unplayed' : 'Mark game as played'}
			onClick={handleMarkAsPlayed}
			disabled={isLoading}
			className={styles.markAsPlayed}
		/>
	);
};

const RemoveGame = ({ gameId }: { gameId: string }) => {
	const { data } = useUser();
	const { mutateAsync, isLoading } = useGameRemover('/');
	const { data: gameOwner } = useGameOwner(gameId);

	const handleRemoveGame = () => {
		if (isLoading) return;

		const isSure = confirm('Are you sure you want to remove this game?');

		if (!isSure) return;

		toast.promise(
			mutateAsync(gameId),
			{
				pending: 'Removing game...',
				success: 'Removed game!',
				error: 'Could not remove game!'
			},
			{
				position: 'bottom-right'
			}
		);
	};

	if (data?.gameOwnerId !== gameOwner) return null;

	return (
		<TrashCanIcon
			onClick={handleRemoveGame}
			className={`${styles.removeGame} ${
				isLoading ? styles.removeDisabled : ''
			}`}
		/>
	);
};

export default GameSummaryCard;
