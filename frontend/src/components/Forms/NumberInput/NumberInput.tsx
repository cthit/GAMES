import { FC } from 'react';

interface TextInputProps {
	label: string;
	type: 'text' | 'number';
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value?: string;
}

const NumberInput: FC<TextInputProps> = ({ label, onChange, value }) => {
	const nums = '0123456789';
	return (
		<>
			<label htmlFor="label">{label}</label>
			<input type="number" name="label" onChange={onChange}
				value={value} />
		</>
	);
};

export default NumberInput;
