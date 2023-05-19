import { FC } from 'react';
import styles from './Button.module.scss';

interface ButtonProps {
	label: string;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
	className?: string;
}

const Button: FC<ButtonProps> = ({ label, onClick, disabled, className }) => {
	return (
		<button
			className={`${styles.button} ${className ?? ''}`}
			onClick={onClick}
			disabled={disabled}
		>
			{label}
		</button>
	);
};

export default Button;
