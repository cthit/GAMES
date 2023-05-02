import { FC, useState } from 'react';
import TextInput from '@/src/components/Forms/TextInput/TextInput';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AxiosError } from 'axios';
import Select from 'react-select';
import Checkbox from '../../Forms/Checkbox/Checkbox';

interface ManageOrganizationProps {
	organizationId: string;
}

interface SuperGroup {
	name: string;
	prettyName: string;
}

interface Organization {
	name: string;
	gammaSuperGroups: string[];
	addGammaAsOrgAdmin: boolean;
}

const ManageOrganization: FC<ManageOrganizationProps> = (props) => {
	const superGroupsQuery = useQuery<SuperGroup[], AxiosError>(
		['siteAdmin', 'superGroups'],
		async () => {
			return (await axios.get('/api/v1/admin/gamma/supergroups')).data;
		}
	);

	const [name, setName] = useState('');
	const [superGroups, setSuperGroups] = useState<string[]>([]);
	const [addGammaAsAdmin, setAddGammaAsAdmin] = useState<boolean>(true);

	const organizationQuery = useQuery<Organization, AxiosError>(
		['siteAdmin', 'organization', props.organizationId],
		async () => {
			return (await axios.get('/api/v1/admin/orgs/' + props.organizationId))
				.data;
		},
		{
			onSettled: (data, error) => {
				if (error || data === undefined) return;
				setName(data.name);
				setSuperGroups(data.gammaSuperGroups);
				setAddGammaAsAdmin(data.addGammaAsOrgAdmin);
			}
		}
	);

	if (superGroupsQuery.isLoading || organizationQuery.isLoading) {
		return <p>Loading...</p>;
	}

	if (organizationQuery.isError) {
		if (organizationQuery.error.code == '404') {
			return <p>404: Organization not found</p>;
		}
		return <p>Something went wrong: {organizationQuery.error.message}</p>;
	}

	if (superGroupsQuery.isError) {
		return <p>Something went wrong: {superGroupsQuery.error.message}</p>;
	}

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				await axios.post('/api/v1/admin/orgs/add', {
					name: name,
					gammaSuperGroups: superGroups,
					addGammaAsOrgAdmin: addGammaAsAdmin
				});
				location.href = './';
			}}
		>
			<TextInput
				label="Name of organization"
				type="text"
				onChange={(input) => setName(input.currentTarget.value)}
				value={name}
			/>
			<br />

			<Select
				name="Gamma super groups"
				isMulti
				options={superGroupsQuery.data.map((superGroup) => ({
					label: superGroup.prettyName,
					value: superGroup.name
				}))}
				className="basic-multi-select"
				classNamePrefix="select"
				onChange={(select) =>
					setSuperGroups(select.map((option) => option.value))
				}
			/>
			<br />

			<Checkbox
				label="Add gamma users as organization admins"
				onChange={(e) => {
					setAddGammaAsAdmin(e.currentTarget.checked);
				}}
				checked={addGammaAsAdmin}
			/>

			<br />

			<input type="submit" value="Submit" />
		</form>
	);
};

export default ManageOrganization;
