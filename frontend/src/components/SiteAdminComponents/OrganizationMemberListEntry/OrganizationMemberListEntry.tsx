import { FC } from 'react';
import styles from './OrganizationListEntry.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AxiosError } from 'axios';

interface OrganizationMemberListEntryProps {
	orgId: string;
	userId: string;
	name: string;
	isAdmin: boolean;
	addedFromGamma: boolean;
}

const OrganizationMemberListEntry: FC<OrganizationMemberListEntryProps> = (
	props
) => {
	const queryClient = useQueryClient();

	const removeUserMutation = useMutation<
		unknown,
		AxiosError,
		{ orgId: string; userId: string }
	>(
		async ({ orgId, userId }) => {
			return axios.delete(`/api/v1/admin/orgs/${orgId}/members/${userId}`);
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries([
					'siteAdmin',
					'organization',
					props.orgId
				]);
			}
		}
	);

	return (
		<li className={styles.card}>
			<h2>{name}</h2>
			<a href={`/admin/organizations/${id}`}>Manage Organization</a>
		</li>
	);
};

export default OrganizationMemberListEntry;
