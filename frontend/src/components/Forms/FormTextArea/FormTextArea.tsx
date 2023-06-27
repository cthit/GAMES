import React, { FC, TextareaHTMLAttributes } from 'react';
import { UseFormRegister, FieldValues, RegisterOptions } from 'react-hook-form';
import styles from './FormTextArea.module.scss';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	name: string;
	label?: string;
	error?: string;
	register?: UseFormRegister<any>;
	registerOptions?: RegisterOptions;
	className?: string;
}

const FormTextArea: FC<TextAreaProps> = ({
	register,
	registerOptions,
	name,
	error,
	label,
	...rest
}) => {
	return (
		<div className={styles.box}>
			{label && <label className={styles.label} htmlFor={name}>{label}</label>}
			<textarea className={styles.inputBox}
				aria-invalid={error ? 'true' : 'false'}
				{...(register ? register(name, registerOptions) : {})}
				{...rest}
			/>
			{error && <span role="alert">{error}</span>}
		</div>
	);
};

export default FormTextArea;
