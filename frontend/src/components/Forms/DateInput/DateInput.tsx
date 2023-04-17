import { FC } from 'react';

interface DateInputProps {
	label: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value?: string;
}

const DateInput: FC<DateInputProps> = ({ label, onChange }) => {
	return (
		<>
			<label htmlFor="label">{label}</label>
			<br />
			<input type="date" name="label" onChange={onChange} />
		</>
	);
};

export default DateInput;
