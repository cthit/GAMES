import { FC } from 'react';
import styles from './TextArea.module.scss'
interface TextAreaProps {
	label: string;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	value?: string;
}

const TextArea: FC<TextAreaProps> = ({ label, onChange }) => {
	return (
		<div className={styles.wrapper}>
			<label htmlFor="label">{label}</label>
			<br />
			<textarea name="label" onChange={onChange} />
		</div>
	);
};

export default TextArea;
