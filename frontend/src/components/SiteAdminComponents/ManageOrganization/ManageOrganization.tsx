import { FC, useState } from 'react';
import TextInput from '@/src/components/Forms/TextInput/TextInput';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AxiosError } from 'axios';
import Select from 'react-select';
import Checkbox from '../../Forms/Checkbox/Checkbox';
import OrganizationMemberList from '../OrganizationMemberList/OrganizationMemberList';
import AddOrganizationMember from '../AddOrganizationMember/AddOrganizationMember';

interface ManageOrganizationProps {
	organizationId: string;
}

interface SuperGroup {
	name: string;
	prettyName: string;
}

interface Member {
	organizationId: string;
	userId: string;
	addedFromGamma: boolean;
	isAdmin: boolean;
}

interface Organization {
	id: string;
	name: string;
	gammaSuperNames: string[];
	addGammaAsOrgAdmin: boolean;
	members: Member[];
}

const ManageOrganization: FC<ManageOrganizationProps> = (props) => {
	const queryClient = useQueryClient();

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
				setSuperGroups(data.gammaSuperNames);
				setAddGammaAsAdmin(data.addGammaAsOrgAdmin);
			}
		}
	);

	const updateOrganizationMutation = useMutation<
		unknown,
		AxiosError,
		{
			organizationId: string;
			name: string;
			gammaSuperGroups: string[];
			addGammaAsOrgAdmin: boolean;
		}
	>(
		(updatedOrganization) => {
			return axios.put(
				'/api/v1/admin/orgs/' + props.organizationId,
				updatedOrganization
			);
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries([
					['siteAdmin', 'organization', props.organizationId]
				]);
			}
		}
	);

	if (
		superGroupsQuery.isLoading ||
		organizationQuery.isLoading ||
		updateOrganizationMutation.isLoading
	) {
		return <p>Loading...</p>;
	}

	if (organizationQuery.isError) {
		if (organizationQuery.error.code == '404') {
			return <p>404: Organization not found</p>;
		}
		return <p>Something went wrong: {organizationQuery.error.message}</p>;
	}

	if (superGroupsQuery.isError)
		return <p>Something went wrong: {superGroupsQuery.error.message}</p>;

	if (updateOrganizationMutation.isError)
		return (
			<p>
				Something went when updating organization wrong:{' '}
				{updateOrganizationMutation.error.message}
			</p>
		);
	return (
		<>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					await updateOrganizationMutation.mutateAsync({
						organizationId: props.organizationId,
						name: name,
						gammaSuperNames: superGroups,
						addGammaAsOrgAdmin: addGammaAsAdmin
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

				<label>Gamma super groups</label>
				<Select
					name="Gamma super groups"
					isMulti
					options={superGroupsQuery.data.map((superGroup) => ({
						label: superGroup.prettyName,
						value: superGroup.name
					}))}
					value={superGroupsQuery.data
						.filter((superGroup) => superGroups?.includes(superGroup.name))
						.map((superGroup) => ({
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

				<input type="submit" value="Save changes" />
			</form>

			<AddOrganizationMember
				organizationId={props.organizationId}
				currentMemberIds={organizationQuery.data.members.map(
					(member) => member.userId
				)}
			/>

			<hr />

			<OrganizationMemberList organization={organizationQuery.data} />
		</>
	);
};

export default ManageOrganization;
