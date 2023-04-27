import { FC } from 'react';

interface TextInputProps {
	label: string;
	type: 'text' | 'number';
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value?: string;
}

const NumberInput: FC<TextInputProps> = ({ label, onChange, value }) => {
	return (
		<>
			<label htmlFor="label">{label}</label>
			<input type="number" name="label" onChange={onChange} value={value} />
		</>
	);
};

export default NumberInput;
