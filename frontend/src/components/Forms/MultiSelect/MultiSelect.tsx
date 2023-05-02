import { FC } from 'react';

interface MultiSelectProps {
	label: string;
	options: Option[];
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	value: string;
}

interface Option {
	name: string;
	value: string;
}

const MultiSelect: FC<MultiSelectProps> = ({
	label,
	options,
	onChange,
	value
}) => {
	return (
		<>
			<label htmlFor="label">{label}</label>
			<select name="label" onChange={onChange} value={value} multiple>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.name}
					</option>
				))}
			</select>
		</>
	);
};

export default MultiSelect;
