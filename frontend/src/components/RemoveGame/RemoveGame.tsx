import { useApiPost } from '@/src/hooks/apiHooks';
import { FC, useState } from 'react';
import DateInput from '../Forms/DateInput/DateInput';

interface RemoveGameProps {
	id: string;
}

const RemoveGame: FC<RemoveGameProps> = ({ id }) => {
	const { postData } = useApiPost('/games/remove');
	return (
		<input
			type="button"
			value="Remove Game"
			onClick={() => {
				postData({ id: id });
			}}
		/>
	);
};

export default RemoveGame;
