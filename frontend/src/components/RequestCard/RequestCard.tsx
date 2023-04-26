import { FC } from 'react';
import styles from './RequestCard.module.css';
import { useApiPost } from '@/src/hooks/apiHooks';

interface RequestCardProps {
    gameId: string,
    name: string,
    user: string,
    borrowStart: string,
    borrowEnd: string
}

const RequestCard: FC<RequestCardProps> = ({
	gameId,
    name,
    user,
    borrowStart,
    borrowEnd
}) => {

    const {
		error: postError,
		loading: postLoading,
		postData
	} = useApiPost('/borrow/request/respond');

	return (
		<li className={styles.card}>
			<h2>{name}</h2>
			<p>Requested by: {user}</p>
			<p>From: {borrowStart?.split('T')[0] || ''}</p>
			<p>To: {borrowEnd?.split('T')[0] || ''}</p>
			<form onSubmit={(e) => {
				e.preventDefault();
				postData({
					gameId: gameId,
                    startDate: borrowStart,
                    endDate: borrowEnd,
                    approved: true
				});
			}}>
				<input type="submit" value="Approve" />
			</form>
            <form onSubmit={(e) => {
				e.preventDefault();
				postData({
					gameId: gameId,
                    startDate: borrowStart,
                    endDate: borrowEnd,
                    approved: false
				});
			}}>
				<input type="submit" value="Deny" />
			</form>
		</li>
	);
};

export default RequestCard;
