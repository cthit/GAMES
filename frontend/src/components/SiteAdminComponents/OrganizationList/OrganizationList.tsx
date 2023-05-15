import { ChangeEvent, FC, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AxiosError } from 'axios';
import styles from './OrganizationList.module.scss';
import OrganizationListEntry from '../OrganizationListEntry/OrganizationListEntry';

interface OrganizationListProps {}

interface Organization {
	id: string;
	name: string;
}

const OrganizationList: FC<OrganizationListProps> = () => {
	const queryClient = useQueryClient();
	const { data, isLoading, isError, error } = useQuery<
		Organization[],
		AxiosError
	>({
		queryKey: ['siteAdmin', 'organizations'],
		queryFn: async () => (await axios.get('/api/v1/admin/orgs')).data
	});

	return (
		<>
			<div style={{ width: 'auto' }}>
				{isLoading ? <p>Loading...</p> : null}

				{isError ? <p>Error: {error.message}</p> : null}

				{data ? (
					<ul className={styles.organizationsList}>
						{data.map((game: Organization) => (
							<OrganizationListEntry
								key={game.id}
								id={game.id}
								name={game.name}
							/>
						))}
					</ul>
				) : null}
			</div>
		</>
	);
};

export default OrganizationList;
