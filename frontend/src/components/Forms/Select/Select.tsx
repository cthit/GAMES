import { FC, useEffect, useState } from 'react';
import styles from './Select.module.scss';

interface SelectProps {
	label: string;
	options: string[];
	values?: string[];
	placeholder: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	value: string;
}

const Select: FC<SelectProps> = ({
	label,
	options,
	values,
	placeholder,
	onChange,
	value
}) => {
	// I don't really like this, but I couldn't really think of a better way that does not involve
	// making basically two versions of this component
	const [optionsAndValues, setOptionsAndValues] = useState<
		{
			option: string;
			value: string;
		}[]
	>([]);

	useEffect(() => {
		if (values) {
			setOptionsAndValues(
				options.map((option, index) => ({
					option,
					value: values[index]
				}))
			);
		} else {
			setOptionsAndValues(options.map((option) => ({ option, value: option })));
		}
	}, [values, options]);

	if (values && values.length > options.length) {
		return <p>Values and options of different lengths!</p>;
	}

	return (
		<div className={styles.selectDiv}>
			<label htmlFor="label" className={styles.label}>{label}</label>
			<select name="label" onChange={onChange} className={styles.selector} value={value}>
				<option value="">{placeholder}</option>
				{optionsAndValues.map(({ option, value }) => (
					<option key={option} value={value}>
						{option}
					</option>
				))}
			</select>
		</div>
	);
};

export default Select;
