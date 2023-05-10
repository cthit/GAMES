import { useUser } from '@/src/hooks/api/auth';
import { useBorrow, useBorrowRequest } from '@/src/hooks/api/borrow';
import { useGameOwner } from '@/src/hooks/api/games';
import { usePlatforms } from '@/src/hooks/api/usePlatforms';
import { FC, useState } from 'react';
import DateInput from '../Forms/DateInput/DateInput';

interface BorrowGameProps {}

const BorrowGame: FC<BorrowGameProps> = () => {
	let game: string = '';
	if (typeof window !== 'undefined') {
		const queryParams = new URLSearchParams(window.location.search);
		game = queryParams.get('game') ?? '';
	}

	const { data, isLoading } = usePlatforms();
	const { data: user, isLoading: loadingUser } = useUser();
	const { data: gameOwner, isLoading: gameOwnerLoading } = useGameOwner(
		game ?? ''
	);
	const { mutate: borrowGame } = useBorrow();
	const { mutate: requestBorrow } = useBorrowRequest();

	const [startDate, setStartDate] = useState<Date>();
	const [endDate, setEndDate] = useState<Date>();

	if (isLoading || loadingUser || gameOwnerLoading) {
		return <p>Loading...</p>;
	}

	if (!data || !user || !gameOwner) {
		return <p>Uh oh</p>;
	}

	return (
		<form onSubmit={(e) => e.preventDefault()}>
			<DateInput
				label="Start date"
				onChange={(input) => setStartDate(new Date(input.currentTarget.value))}
				value={startDate?.toISOString().split('T')[0] || ''}
			/>
			<br />

			<DateInput
				label="End date"
				onChange={(input) => setEndDate(new Date(input.currentTarget.value))}
				value={endDate?.toISOString().split('T')[0] || ''}
			/>
			<br />

			<input
				type="submit"
				value="Request Borrow"
				onClick={(e) => {
					e.preventDefault();

					if (!startDate || !endDate || !game) return;

					requestBorrow({
						borrowEnd: endDate,
						borrowStart: startDate,
						gameId: game,
						user: 'User'
					});
				}}
			/>

			{user.gameOwnerId === gameOwner.gameOwner ? (
				<input
					type="submit"
					value="Borrow"
					onClick={(e) => {
						e.preventDefault();

						if (!startDate || !endDate || !game) return;

						borrowGame({
							borrowEnd: endDate,
							borrowStart: startDate,
							gameId: game,
							user: 'User'
						});
					}}
				/>
			) : null}
		</form>
	);
};

export default BorrowGame;
