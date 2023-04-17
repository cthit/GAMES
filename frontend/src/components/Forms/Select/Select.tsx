import { FC } from 'react';

interface SelectProps {
	label: string;
	options: string[];
	placeholder: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	value: string;
}

const Select: FC<SelectProps> = ({
	label,
	options,
	placeholder,
	onChange,
	value
}) => {
	return (
		<>
			<label htmlFor="label">{label}</label>
			<select name="label" onChange={onChange} value={value}>
				<option value="">{placeholder}</option>
				{options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</>
	);
};

export default Select;
