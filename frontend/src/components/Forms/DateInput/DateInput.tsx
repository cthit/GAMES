import { FC } from 'react';
import styles from './DateInput.module.scss';

interface DateInputProps {
	label: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value?: string;
}

const DateInput: FC<DateInputProps> = ({ label, onChange }) => {
	return (
		<div className={styles.dateDiv}>
			<label htmlFor={label} className={styles.label}>
				{label}
			</label>
			<input
				className={styles.input}
				type="date"
				name={label}
				onChange={onChange}
			/>
		</div>
	);
};

export default DateInput;
