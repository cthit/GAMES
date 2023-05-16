import { useApiGet } from '@/src/hooks/apiHooks';
import { ChangeEvent, FC, useState } from 'react';
import RequestCard from '../RequestCard/RequestCard';
import { useBorrowRequestList } from '@/src/hooks/api/borrow';

interface BorrowRequestsListProps {}

interface BorrowRequest {
	gameId: string;
	name: string;
	user: string;
	borrowStart: string;
	borrowEnd: string;
}

const BorrowRequestsList: FC<BorrowRequestsListProps> = () => {
	const { data, error, isLoading } = useBorrowRequestList();

	return (
		<div style={{ width: 'auto' }}>
			{isLoading ? <p>Loading...</p> : null}

			{error ? <p>Error: {error.message}</p> : null}

			{data?.length == 0 ? (
				<p>There are no active requests at this time.</p>
			) : null}

			{data ? (
				<ul>
					{data.map((request) => (
						<RequestCard
							key={`${request.gameId}.${request.user}.${request.borrowStart}.${request.borrowEnd}`}
							borrowRequest={request}
						/>
					))}
				</ul>
			) : null}
		</div>
	);
};

export default BorrowRequestsList;
