import { useApiGet } from '@/src/hooks/apiHooks';
import { ChangeEvent, FC, useState } from 'react';
import styles from './BookingsList.module.scss';
import BookingCard from '../BookingCard/BookingCard';

interface BookingsListProps {}

interface Booking {
    gameName: string,
    user: string,
    borrowStart: string,
    borrowEnd: string
}

const BookingsList: FC<BookingsListProps> = () => {
	const [apiPath, setApiPath] = useState("/borrow/list")
	const { data, error, loading } = useApiGet<Booking[]>(apiPath);

	return (
		<div style={{width: 'auto'}}>

			{loading ? <p>Loading...</p> : null}

			{error ? <p>Error: {error}</p> : null}

			{data ? (
				<ul className={styles.bookingsList}>
					{data.map((booking) => (
						<BookingCard
							key={`${booking.gameName}.${booking.borrowStart}.${booking.borrowEnd}`}
							game={booking.gameName}
                            user={booking.user}
                            start={booking.borrowStart}
                            end={booking.borrowEnd}
						/>
					))}
				</ul>
			) : null}
		</div>
	);
};

export default BookingsList;
