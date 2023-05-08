import { FC } from 'react';

interface CheckboxProps {
	label: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	checked?: boolean;
}

const Checkbox: FC<CheckboxProps> = ({ label, onChange, checked }) => {
	return (
		<>
			<label htmlFor="label">{label}</label>
			<input
				type="checkbox"
				name="label"
				onChange={onChange}
				checked={checked}
			/>
		</>
	);
};

export default Checkbox;
