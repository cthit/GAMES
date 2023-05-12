import React, { FC } from 'react';
import Select, { Props } from 'react-select';
import {
	UseFormRegister,
	FieldValues,
	Controller,
	Control
} from 'react-hook-form';

interface Option {
	value: string;
	label: string;
}

interface SelectProps extends Props {
	name: string;
	label?: string;
	error?: string;
	register?: any;
	control?: Control<any, any>;
	wrapperClass?: string;
	className?: string;
}

const FormSelect: FC<SelectProps> = ({
	register,
	name,
	error,
	label,
	control,
	options,
	wrapperClass,
	...rest
}) => {
	return (
		<div className={wrapperClass}>
			{label && <label htmlFor={name}>{label}</label>}
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, value, ref } }) => (
					<Select
						ref={ref}
						value={value}
						onChange={onChange}
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
