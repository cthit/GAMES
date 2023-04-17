import { FC } from 'react';

interface TextAreaProps {
	label: string;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	value?: string;
}

const TextArea: FC<TextAreaProps> = ({ label, onChange }) => {
	return (
		<>
			<label htmlFor="label">{label}</label>
			<br />
			<textarea name="label" onChange={onChange} />
		</>
	);
};

export default TextArea;
