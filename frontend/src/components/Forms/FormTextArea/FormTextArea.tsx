import React, { FC, TextareaHTMLAttributes } from 'react';
import { UseFormRegister, FieldValues, RegisterOptions } from 'react-hook-form';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	name: string;
	label?: string;
	error?: string;
	register?: UseFormRegister<any>;
	registerOptions?: RegisterOptions;
	wrapperClass?: string;
	className?: string;
}

const FormTextArea: FC<TextAreaProps> = ({
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
			<textarea
				aria-invalid={error ? 'true' : 'false'}
				{...(register ? register(name, registerOptions) : {})}
				{...rest}
			/>
			{error && <span role="alert">{error}</span>}
		</div>
	);
};

export default FormTextArea;
