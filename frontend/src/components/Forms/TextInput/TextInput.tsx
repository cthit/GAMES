import { FC } from 'react';

interface TextInputProps {
	label: string;
	type: 'text' | 'number';
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value?: string;
}

const TextInput: FC<TextInputProps> = ({ label, onChange, value }) => {
	return (
		<>
			<label htmlFor="label">{label}</label>
			<input type="text" name="label" onChange={onChange} value={value} />
		</>
	);
};

export default TextInput;
