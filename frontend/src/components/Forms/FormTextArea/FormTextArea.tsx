import React, { FC, TextareaHTMLAttributes } from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	name: string;
	label?: string;
	error?: string;
	register?: any;
	wrapperClass?: string;
	className?: string;
}

const FormTextArea: FC<TextAreaProps> = ({
	register,
	name,
	error,
	label,
	wrapperClass,
	...rest
}) => {
	return (
		<div className={wrapperClass}>
			{label && <label htmlFor={name}>{label}</label>}
			<textarea
				aria-invalid={error ? 'true' : 'false'}
				{...register(name)}
				{...rest}
			/>
			{error && <span role="alert">{error}</span>}
		</div>
	);
};

export default FormTextArea;
