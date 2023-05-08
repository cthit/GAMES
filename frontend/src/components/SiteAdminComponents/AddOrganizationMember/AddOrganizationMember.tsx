import { FC, useState } from 'react';
import TextInput from '@/src/components/Forms/TextInput/TextInput';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AxiosError } from 'axios';
import Select from 'react-select';
import Checkbox from '../../Forms/Checkbox/Checkbox';
import styles from './AddOrganizationMember.module.css';

interface AddOrganizationMemberProps {
	organizationId: string;
	currentMemberIds: string[];
}

interface Account {
	id: string;
	nick: string;
}

const AddOrganizationMember: FC<AddOrganizationMemberProps> = (props) => {
	const queryClient = useQueryClient();
	const accountsQuery = useQuery<Account[], AxiosError>(
		['siteAdmin', 'accounts'],
		async () => {
			return (await axios.get('/api/v1/admin/accounts')).data;
		},
		{
			cacheTime: 60000,
			staleTime: 60000
		}
	);

	const addAccountMutation = useMutation<
		unknown,
		AxiosError,
		{ userId: string; isOrgAdmin: boolean }
	>(
		async (data) => {
			return await axios.post(
				'/api/v1/admin/orgs/' + props.organizationId + '/member',
				data
			);
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries([
					'siteAdmin',
					'organization',
					props.organizationId
				]);
			}
		}
	);

	const [accountToAdd, setAccountToAdd] = useState('');
	const [addAsAdmin, setAddAsAdmin] = useState(false);

	if (accountsQuery.isLoading) return <p>Loading...</p>;

	if (accountsQuery.isError)
		return <p>Something went wrong: {accountsQuery.error.message}</p>;

	if (addAccountMutation.isLoading) return <p>Adding member...</p>;

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				await addAccountMutation.mutateAsync({
					userId: accountToAdd,
					isOrgAdmin: addAsAdmin
				});
				//TODO - Display success message
				setAccountToAdd('');
				setAddAsAdmin(false);
			}}
		>
			<Select
				name="Gamma super groups"
				options={accountsQuery.data
					// Filter out accounts that are already members of the organization
					.filter((a) => !props.currentMemberIds.includes(a.id))
					.map((account) => ({
						label: account.nick,
						value: account.id
					}))}
				className="basic-single"
				classNamePrefix="select"
				onChange={(select) =>
					setAccountToAdd(select?.value ? select?.value : '')
				}
			/>

			<br />

			<Checkbox
				label="Add as admin"
				checked={addAsAdmin}
				onChange={(e) => setAddAsAdmin(e.currentTarget.checked)}
			/>

			<br />

			<input type="submit" value="Add member" disabled={accountToAdd === ''} />
			{addAccountMutation.isError && (
				<p>
					Something went wrong adding member: {addAccountMutation.error.message}
				</p>
			)}
		</form>
	);
};

export default AddOrganizationMember;
