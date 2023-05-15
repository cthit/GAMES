import { FC } from 'react';
import styles from './OrganizationMemberListEntry.module.scss';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AxiosError } from 'axios';
import Checkbox from '../../Forms/Checkbox/Checkbox';

interface OrganizationMemberListEntryProps {
	orgId: string;
	userId: string;
	isAdmin: boolean;
	addedFromGamma: boolean;
}

const OrganizationMemberListEntry: FC<OrganizationMemberListEntryProps> = (
	props
) => {
	const queryClient = useQueryClient();

	const userNicknameQuery = useQuery<
		{ userId: string; nick: string },
		AxiosError
	>(
		['userNickname', props.userId],
		async () => {
			return (await axios.get('/api/v1/account/' + props.userId + '/nick'))
				.data;
		},
		{
			staleTime: 3600000,
			cacheTime: 3600000
		}
	);

	const removeUserMutation = useMutation<
		unknown,
		AxiosError,
		{ orgId: string; userId: string }
	>(
		async ({ orgId, userId }) => {
			return axios.delete(`/api/v1/admin/orgs/${orgId}/member/${userId}`);
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

	const updateAdminStatusMutation = useMutation<
		unknown,
		AxiosError,
		{ orgId: string; userId: string; isOrgAdmin: boolean }
	>(
		async ({ orgId, userId, isOrgAdmin }) => {
			return axios.put(`/api/v1/admin/orgs/${orgId}/setAdminStatus`, {
				userId,
				isOrgAdmin
			});
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

	if (userNicknameQuery.isLoading) {
		return <li className={styles.card}>Loading...</li>;
	}

	if (userNicknameQuery.isError) {
		return <li className={styles.card}>Error loading user nickname</li>;
	}

	return (
		<li className={styles.card}>
			<h2>{userNicknameQuery.data.nick}</h2>
			<Checkbox
				label="Is org admin"
				checked={props.isAdmin}
				onChange={(e) => {
					updateAdminStatusMutation.mutate({
						orgId: props.orgId,
						userId: props.userId,
						isOrgAdmin: e.target.checked
					});
				}}
			/>
			{props.addedFromGamma && (
				<p>
					Added from Gamma, will be re-added if removed but is still in any of
					the gamma super groups
				</p>
			)}
			<button
				onClick={() => {
					removeUserMutation.mutate({
						orgId: props.orgId,
						userId: props.userId
					});
				}}
			>
				Remove from org
			</button>
		</li>
	);
};

export default OrganizationMemberListEntry;
