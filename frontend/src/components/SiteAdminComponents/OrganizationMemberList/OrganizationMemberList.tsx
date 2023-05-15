import { FC } from 'react';
import styles from './OrganizationMemberList.module.scss';
import OrganizationMemberListEntry from '../OrganizationMemberListEntry/OrganizationMemberListEntry';

interface OrganizationMemberListProps {
	organization: Organization;
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
	members: Member[];
}

const OrganizationMemberList: FC<OrganizationMemberListProps> = (props) => {
	return (
		<>
			<div style={{ width: 'auto' }}>
				<ul className={styles.organizationsList}>
					{props.organization.members.length === 0 ? (
						<p>No members</p>
					) : (
						props.organization.members.map((member: Member) => (
							<OrganizationMemberListEntry
								key={member.userId}
								orgId={props.organization.id}
								userId={member.userId}
								isAdmin={member.isAdmin}
								addedFromGamma={member.addedFromGamma}
							/>
						))
					)}
				</ul>
			</div>
		</>
	);
};

export default OrganizationMemberList;
