import React, { FC } from 'react';
import Select, { Props } from 'react-select';
import {
	UseFormRegister,
	FieldValues,
	Controller,
	Control
} from 'react-hook-form';
import Option from 'react-select/dist/declarations/src/components/Option';
import styles from './FormSelect.module.scss';

interface Option {
	value: string;
	label: string;
}

interface SelectProps extends Props {
	name: string;
	label?: string;
	error?: string;
	options: Option[];
	control?: Control<any, any>;
	value?: Option;
}

const FormSelect: FC<SelectProps> = ({
	name,
	error,
	label,
	control,
	options,
	value: defaultValue,
	...rest
}) => {
	return (
		<div className={styles.box}>
			{label && <label className={styles.label} htmlFor={name}>{label}</label>}
			<Controller
				control={control}
				defaultValue={defaultValue}

				name={name}
				render={({ field: { onChange, value, ref } }) => (
					<Select
						className={styles.inputBox}
						ref={ref}
						value={
							Array.isArray(value)
								? options.filter((option) => value.includes(option.value))
								: options.find((option) => option.value === value)
						}
						onChange={(e) => {
							if (Array.isArray(e)) {
								onChange(e.map((option) => option.value));
							} else {
								onChange((e as Option).value);
							}
						}}
						options={options}
						{...rest}
					/>
				)}
			/>
			{error && <span role="alert">{error}</span>}
		</div>
	);
};

export default FormSelect;
