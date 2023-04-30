import { useApiPost } from '@/src/hooks/apiHooks';
import { FC, useState } from 'react';

interface RemoveGameProps {
	id: string;
}

const RemoveGame: FC<RemoveGameProps> = ({ id }) => {
	const { postData } = useApiPost('/games/remove');
	return (
		<input
			type="button"
			value="Remove Game"
			onClick={async () => {
				await postData({ id: id });
					location.reload();
				}}
		/>
	);
};

export default RemoveGame;
