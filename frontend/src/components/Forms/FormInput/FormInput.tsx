import React, { FC, InputHTMLAttributes } from 'react';
import { UseFormRegister, RegisterOptions } from 'react-hook-form';
import styles from './FormInput.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	name: string;
	label?: string;
	error?: string;
	register?: UseFormRegister<any>;
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
		<div className={styles.container}>
			{label && <label htmlFor={name} className={styles.label} >{label}</label>}<br />
			<input className={styles.inputBox}
				aria-invalid={error ? 'true' : 'false'}
				{...(register ? register(name, registerOptions) : {})}
				{...rest}
			/>
			{error && <span role="alert">{error}</span>}
		</div>
	);
};

export default FormInput;
