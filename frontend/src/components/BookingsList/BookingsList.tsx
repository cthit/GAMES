import { useApiGet } from '@/src/hooks/apiHooks';
import { ChangeEvent, FC, useState } from 'react';
import styles from './BookingsList.module.scss';
import BookingCard from '../BookingCard/BookingCard';
import { useBorrowsList } from '@/src/hooks/api/borrow';

interface BookingsListProps {}

const BookingsList: FC<BookingsListProps> = () => {
	const { data, error, isLoading } = useBorrowsList();

	return (
		<div style={{ width: 'auto' }}>
			{isLoading ? <p>Loading...</p> : null}

			{error ? <p>Error: {error.message}</p> : null}

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
