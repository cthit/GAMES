import { useApiPost } from '@/src/hooks/apiHooks';
import { FC, useState } from 'react';
import TextInput from '../Forms/TextInput/TextInput';

interface AddPlatformProps {}

const AddPlatform: FC<AddPlatformProps> = () => {
	const [name, setName] = useState('');

	const {
		error: postError,
		loading: postLoading,
		postData
	} = useApiPost('/platforms/add');

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				postData({
					name
				});
			}}
		>
			<TextInput
				label="Name of the platform"
				type="text"
				onChange={(input) => setName(input.currentTarget.value)}
				value={name}
			/>
			<br />

			<input type="submit" value="Submit" />
		</form>
	);
};

export default AddPlatform;
