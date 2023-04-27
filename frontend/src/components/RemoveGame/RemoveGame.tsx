import { useApiGet, useApiPost } from '@/src/hooks/apiHooks';
import { FC, useState } from 'react';
import DateInput from '../Forms/DateInput/DateInput';

interface RemoveGameProps {
	id: string;

}

const RemoveGame: FC<RemoveGameProps> = ({ 
	id,
	}) => {
		return (
		<form action="/"
			onSubmit={(e) => {
				//Something goes here?
			}}
		>
			<input type="submit" value="Remove Game" />
		</form>
	);
};

export default RemoveGame;
