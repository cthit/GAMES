import { FC } from 'react';
import styles from './BookingCard.module.scss';

interface BookingCardProps {
    game: string,
    user: string,
    start: string,
    end: string
}

const BookingCard: FC<BookingCardProps> = ({
    game,
    user,
    start,
    end
}) => {
	return (
		<li className={styles.card}>
			<h2>{game}</h2>
			<p>Booked by {user}</p>
            <p>From {start}</p>
            <p>To {end}</p>
		</li>
	);
};

export default BookingCard;
