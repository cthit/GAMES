import { FC } from 'react';
import styles from './GameAttributesCard.module.scss';

interface GameAttributesCardProps {
	owner: string;
	platform: string;
	location: string;
	releaseDate: string;
	playtime: number;
	playerMax: number;
	playerMin: number;
	borrowed: boolean;
}

const GameAttributesCard: FC<GameAttributesCardProps> = ({
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
	);
};

const Property = ({ title, value }: { title: string; value: string }) => (
	<p className={styles.property}>
		<span className={styles.propertyTitle}>{title}:</span> {value}
	</p>
);

export default GameAttributesCard;
