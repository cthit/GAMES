import { useApiGet } from '@/src/hooks/apiHooks';
import { ChangeEvent, FC, useState } from 'react';
import RequestCard from '../RequestCard/RequestCard';
import debounce from 'lodash.debounce';

interface BorrowRequestsListProps {}

interface BorrowRequest {
    gameId: string,
    name: string,
    user: string,
    borrowStart: string,
    borrowEnd: string
}

const BorrowRequestsList: FC<BorrowRequestsListProps> = () => {
	const [apiPath, setApiPath] = useState("/borrow/request/list")
	const { data, error, loading } = useApiGet<BorrowRequest[]>(apiPath);

	return (
		<div style={{width: 'auto'}}>

			{loading ? <p>Loading...</p> : null}

			{error ? <p>Error: {error}</p> : null}

			{data?.length == 0 ? <p>There are no active requests at this time.</p> : null}

			{data ? (
				<ul>
					{data.map((request) => (
						<RequestCard
                            key={request.gameId}
							gameId={request.gameId}
                            name={request.name}
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

export default BorrowRequestsList;
