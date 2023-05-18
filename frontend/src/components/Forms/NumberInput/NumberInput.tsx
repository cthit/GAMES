import { FC } from 'react';
import styles from './NumberInput.module.scss';

interface NumberInputProps {
	label: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value?: string;
	placeholder?: string;
	className?: string;
}

const NumberInput: FC<NumberInputProps> = ({
	label,
	onChange,
	value,
	placeholder,
	className
}) => {
	return (
		<div className={`${styles.inputDiv} ${className ?? ''}`}>
			<label className={styles.label} htmlFor={label}>
				{label}
			</label>

			<input
				className={styles.input}
				type="number"
				name={label}
				onChange={onChange}
				value={value}
				placeholder={placeholder}
			/>
		</div>
	);
};

export default NumberInput;
