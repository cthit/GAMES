import { useUser } from '@/src/hooks/api/auth';
import Link from 'next/link';
import { FC } from 'react';
import Button from '../../Forms/Button/Button';
import styles from './GamePropertiesCard.module.scss';

interface GamePropertiesCardProps {
	gameId: string;
	owner: string;
	platform: string;
	location: string;
	releaseDate: string;
	playtime: number;
	playerMax: number;
	playerMin: number;
	borrowed: boolean;
}

const GamePropertiesCard: FC<GamePropertiesCardProps> = ({
	gameId,
	owner,
	platform,
	location,
	releaseDate,
	playtime,
	playerMax,
	playerMin,
	borrowed
}) => {
	return (
		<div className={styles.card}>
			<div>
				<Property title="Owned by" value={owner} />
				<Property title="Platform" value={platform} />
				<Property title="Location" value={location} />
				<Property title="Release Date" value={releaseDate} />
				<Property title="Playtime" value={`${playtime} min`} />
				<Property
					title="Players"
					value={
						playerMax == playerMin
							? `${playerMin}-${playerMax}`
							: playerMin.toString()
					}
				/>
				<Property
					title="Availability"
					value={borrowed ? 'Borrowed' : 'Not borrowed'}
				/>
			</div>
			<BorrowGame gameId={gameId} />
		</div>
	);
};

const BorrowGame = ({ gameId }: { gameId: string }) => {
	const { data } = useUser();

	if (!data) return null;

	return (
		<Link style={{ textDecoration: 'none' }} href={`/borrow/${gameId}`}>
			<Button label="Borrow game" className={styles.borrowButton} />
		</Link>
	);
};

const Property = ({ title, value }: { title: string; value: string }) => (
	<p className={styles.property}>
		<span className={styles.propertyTitle}>{title}:</span> {value}
	</p>
);

export default GamePropertiesCard;
