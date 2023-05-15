import { FC } from 'react';
import styles from './OrganizationListEntry.module.scss';

interface OrganizationListEntryProps {
	id: string;
	name: string;
}

const OrganizationListEntry: FC<OrganizationListEntryProps> = ({
	id,
	name
}) => {
	return (
		<li className={styles.card}>
			<h2>{name}</h2>
			<a href={`/admin/organizations/${id}`}>Manage Organization</a>
		</li>
	);
};

export default OrganizationListEntry;
