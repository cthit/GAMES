import { useLogout, useUser } from '@/src/hooks/api/auth';
import { FC } from 'react';
import styles from './UserProfile.module.scss';

const UserProfile: FC = () => {
	const { data, isLoading } = useUser();
	const { mutate, isLoading: isLoggingOut } = useLogout();

	if (isLoading) {
		return <div className={styles.profileDiv}>Loading...</div>;
	}

	if (isLoggingOut) {
		return <div className={styles.profileDiv}>Logging out...</div>;
	}

	if (!data) return <div className={styles.profileDiv} ><a className={styles.login} href="/api/v1/auth/login">Login With Gamma</a></ div>

	return (
		<div className={styles.profileDiv}>
			<p onClick={() => mutate()} className={styles.username} >{data.nick}</p>
			<img className={styles.profilePic} src={'/images/default.png'} alt='Your Profile Picture In Gamma' />
		</div>
	);
};

export default UserProfile;
