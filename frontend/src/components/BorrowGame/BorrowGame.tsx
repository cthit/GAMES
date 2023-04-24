import { useApiGet, useApiPost } from '@/src/hooks/apiHooks';
import { FC, useState } from 'react';
import DateInput from '../Forms/DateInput/DateInput';

interface AddGameProps {}

interface Platform {
	name: string;
}

const AddGame: FC<AddGameProps> = () => {
	const { data, error, loading } = useApiGet<Platform[]>('/platforms');

	const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    
    var game: string | null = "";
    if (typeof window !== "undefined") {
        const queryParams = new URLSearchParams(window.location.search)
        game = queryParams.get("game")
    }

    const username = "User"; // TODO: Use actual username when auth is implemented

    let canBorrow = false; // TODO: Check if user has borrow permissions for game when auth is implemented

    const {
        error: postError,
        loading: postLoading,
        postData
    } = (canBorrow) ? useApiPost('/borrow') : useApiPost('/borrow/request');


	if (loading) {
		return <p>Loading...</p>;
	}

	if (!data) {
		return <p>Uh oh</p>;
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				postData({
                    gameId: game,
                    user: username,
                    borrowStart: startDate,
                    borrowEnd: endDate
				});
			}}
		>

			<DateInput
				label="Start date"
				onChange={(input) =>
					setStartDate(new Date(input.currentTarget.value))
				}
				value={startDate?.toISOString().split('T')[0] || ''}
			/>
			<br />

            <DateInput
				label="End date"
				onChange={(input) =>
					setEndDate(new Date(input.currentTarget.value))
				}
				value={endDate?.toISOString().split('T')[0] || ''}
			/>
			<br />


			<input type="submit" value="Submit" />
		</form>
	);
};

export default AddGame;
