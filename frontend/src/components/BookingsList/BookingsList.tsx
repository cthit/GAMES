import { useApiGet } from '@/src/hooks/apiHooks';
import { ChangeEvent, FC, useState } from 'react';
import styles from './BookingsList.module.scss';
import BookingCard from '../BookingCard/BookingCard';
import { useBorrowsList, useOwnBorrowsList } from '@/src/hooks/api/borrow';
import { useUser } from '@/src/hooks/api/auth';

interface BookingsListProps {
}

const BookingsList: FC<BookingsListProps> = () => {
	const [showAll, setShowAll] = useState(true);
	const { data, error, isLoading } = showAll ? useBorrowsList() : useOwnBorrowsList();
	return (
		<>
			<div className={styles.listPage}>
				<p className={styles.showOnBox}>
					<input type='checkbox' onClick={() => setShowAll(!showAll)} /> Only show your own games?
				</p>
				<div style={{ width: 'auto' }}>
					{isLoading ? <p>Loading...</p> : null}

					{error ? <p>Error: {error.message}</p> : null}

					{data ? (
						<ul className={styles.bookingsList}>
							{data.filter((booking) => {
								return new Date(booking.borrowEnd).getTime() > Date.now()
							}).map((booking) => (
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
			</div >
		</>
	);
};

export default BookingsList;
