import { useApiGet } from '@/src/hooks/apiHooks';
import { ChangeEvent, FC, useState } from 'react';
import RequestCard from '../RequestCard/RequestCard';
import styles from '../GamesList/GamesList.module.css';
import debounce from 'lodash.debounce';

interface GamesListProps {}

interface BorrowRequest {
    gameId: string,
    user: string,
    borrowStart: string,
    borrowEnd: string
}

const GamesList: FC<GamesListProps> = () => {
	const [apiPath, setApiPath] = useState("/borrow/request/list")
	const { data, error, loading } = useApiGet<BorrowRequest[]>(apiPath);

    console.log(data)

	return (
		<div style={{width: 'auto'}}>

			{loading ? <p>Loading...</p> : null}

			{error ? <p>Error: {error}</p> : null}

			{data?.length == 0 ? <p>There are no active requests at this time.</p> : null}

			{data ? (
				<ul className={styles.gamesList}>
					{data.map((request) => (
						<RequestCard
							gameId={request.gameId}
                            user={request.user}
                            borrowStart={request.borrowStart}
                            borrowEnd={request.borrowEnd}
						/>
					))}
				</ul>
			) : null}
		</div>
	);
};

export default GamesList;
