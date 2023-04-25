import { FC } from 'react';
import styles from '../GameCard/GameCard.module.css';
import { useApiPost } from '@/src/hooks/apiHooks';

interface RequestCardProps {
    gameId: string,
    user: string,
    borrowStart: string,
    borrowEnd: string
}

const RequestCard: FC<RequestCardProps> = ({
	gameId,
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
			<h2>{gameId}</h2>
			<p>Requested by: {user}</p>
			<p>From: {borrowStart}</p>
			<p>To: {borrowEnd}</p>
			<form onSubmit={(e) => {
				e.preventDefault();
				postData({
					gameId: gameId,
                    user: user,
                    approved: true
				});
			}}>
				<input type="hidden" id="game" name="game" value={gameId} />
                <input type="hidden" id="approved" name="approved" value="true" />
				<input type="submit" value="Approve" />
			</form>
            <form onSubmit={(e) => {
				e.preventDefault();
				postData({
					gameId: gameId,
                    user: user,
                    approved: false
				});
			}}>
				<input type="hidden" id="game" name="game" value={gameId} />
                <input type="hidden" id="approved" name="approved" value="false" />
				<input type="submit" value="Deny" />
			</form>
		</li>
	);
};

export default RequestCard;
