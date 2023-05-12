import React, { FC, InputHTMLAttributes } from 'react';
import { UseFormRegister, FieldValues, RegisterOptions } from 'react-hook-form';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	name: string;
	label?: string;
	error?: string;
	register?: any;
	registerOptions?: RegisterOptions;
	wrapperClass?: string;
	className?: string;
}

const FormInput: FC<InputProps> = ({
	register,
	registerOptions,
	name,
	error,
	label,
	wrapperClass,
	...rest
}) => {
	return (
		<div className={wrapperClass}>
			{label && <label htmlFor={name}>{label}</label>}
			<input
				aria-invalid={error ? 'true' : 'false'}
				{...register(name, registerOptions)}
				{...rest}
			/>
			{error && <span role="alert">{error}</span>}
		</div>
	);
};

export default FormInput;
