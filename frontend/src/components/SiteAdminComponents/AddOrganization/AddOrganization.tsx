import { useApiGet, useApiPost } from '@/src/hooks/apiHooks';
import { FC, useState } from 'react';
import TextInput from '@/src/components/Forms/TextInput/TextInput';
import MultiSelect from '@/src/components/Forms/MultiSelect/MultiSelect';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AxiosError } from 'axios';

interface AddOrganizationProps {}

interface SuperGroup {
	name: string;
	prettyName: string;
}

const AddGame: FC<AddOrganizationProps> = () => {
	const superGroupsQuery = useQuery<SuperGroup[], AxiosError>(
		['siteAdmin', 'superGroups'],
		async () => {
			return (await axios.get('/api/v1/admin/gamma/supergroups')).data;
		}
	);

	const [name, setName] = useState('');
	const [superGroups, setSuperGroups] = useState<string[]>([]);
	const [platform, setPlatform] = useState('');

	const {
		error: postError,
		loading: postLoading,
		postData
	} = useApiPost('/games/add');

	if (superGroupsQuery.isLoading) {
		return <p>Loading...</p>;
	}

	if (superGroupsQuery.isError) {
		return <p>Something went wrong: {superGroupsQuery.error.message}</p>;
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				axios.post('/api/v1/admin/orgs/add', {
					name,
					superGroups
				});
			}}
		>
			<TextInput
				label="Name of organization"
				type="text"
				onChange={(input) => setName(input.currentTarget.value)}
				value={name}
			/>
			<br />

			<MultiSelect
				label="Gamma supergroups"
				options={superGroupsQuery.data.map((superGroup) => ({
					name: superGroup.prettyName,
					value: superGroup.name
				}))}
				onChange={(select) => setSuperGroups(select.target.value)}
				value={superGroups}
			/>
			<br />

			<input type="submit" value="Submit" />
		</form>
	);
};

export default AddGame;
