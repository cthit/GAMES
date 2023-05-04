import { FC, useState } from 'react';
import TextInput from '@/src/components/Forms/TextInput/TextInput';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { AxiosError } from 'axios';
import Select from 'react-select';
import Checkbox from '../../Forms/Checkbox/Checkbox';

interface RemoveOrganizationButtonProps {
	orgId: string;
}

const RemoveOrganizationButton: FC<RemoveOrganizationButtonProps> = (props) => {
	const deleteMutation = useMutation<unknown, AxiosError, string>(
		(orgId) => {
			return axios.delete(`/api/v1/admin/orgs/${orgId}`);
		},
		{
			onSuccess: () => {
				location.href = '/admin/organizations';
			}
		}
	);

	const [confirm, setConfirm] = useState<boolean>(false);
	const [disabled, setDisabled] = useState<boolean>(false);

	if (deleteMutation.isLoading) {
		return <>Removing...</>;
	}

	if (deleteMutation.isError) {
		return (
			<>Error, failed to remove organization: {deleteMutation.error.message}</>
		);
	}

	return (
		<>
			<button
				onClick={async () => {
					if (confirm) {
						deleteMutation.mutate(props.orgId);
					} else {
						setConfirm(true);
						setDisabled(true);
						await new Promise((resolve) => setTimeout(resolve, 5000));
						setDisabled(false);
						await new Promise((resolve) => setTimeout(resolve, 15000));
						setConfirm(false);
					}
				}}
				disabled={disabled}
			>
				{confirm ? (
					<>
						Are you sure you want to remove this organization?
						{disabled ? <> (Wait 5s)</> : <></>}
					</>
				) : (
					<>Remove Organization</>
				)}
			</button>
		</>
	);
};

export default RemoveOrganizationButton;
