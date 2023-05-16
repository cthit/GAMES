import { FC } from 'react';
import styles from './RequestCard.module.scss';
import { useApiPost } from '@/src/hooks/apiHooks';
import { useBorrowRequestRespond } from '@/src/hooks/api/borrow';
import { toast } from 'react-toastify';

interface BorrowRequest {
	gameId: string;
	name: string;
	user: string;
	borrowStart: string;
	borrowEnd: string;
}

interface RequestCardProps {
	borrowRequest: BorrowRequest;
}

const RequestCard: FC<RequestCardProps> = ({ borrowRequest }) => {
	const {
		error: postError,
		isLoading: postLoading,
		mutateAsync: postDataAsync
	} = useBorrowRequestRespond();

	const { gameId, name, user, borrowStart, borrowEnd } = borrowRequest;

	const respondToRequest = async (approved: boolean) => {
		try {
			await toast.promise(
				postDataAsync({
					gameId,
					startDate: borrowStart,
					endDate: borrowEnd,
					approved
				}),
				{
					pending: approved ? 'Approving request...' : 'Denying request...',
					success: approved
						? 'Request approved!'
						: 'Request successfully denied!',
					error: {
						render: () => {
							return (
								<>
									{postError?.response?.status === 401
										? 'You need to be signed in to respond to requests'
										: 'Something went wrong!'}
								</>
							);
						}
					}
				}
			);
		} catch (e) {}
	};

	return (
		<li className={styles.card}>
			<h2>{borrowRequest.name}</h2>
			<p>Requested by: {borrowRequest.user}</p>
			<p>From: {borrowRequest.borrowStart?.split('T')[0] || ''}</p>
			<p>To: {borrowRequest.borrowEnd?.split('T')[0] || ''}</p>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					await respondToRequest(true);
				}}
			>
				<input type="submit" value="Approve" />
			</form>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					await respondToRequest(false);
				}}
			>
				<input type="submit" value="Deny" />
			</form>
		</li>
	);
};

export default RequestCard;
