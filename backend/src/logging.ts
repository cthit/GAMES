import winston from 'winston';
const { combine, timestamp, label, printf } = winston.format;

const logFormat = printf(({ level, message, label, timestamp, stacktrace }) => {
	return `${timestamp} ${level}: ${message} ${
		stacktrace ? '\n' + stacktrace : ''
	}`;
});

export const configureLogging = () => {
	winston.configure({
		transports: [
			new winston.transports.Console({
				format: winston.format.combine(
					winston.format.colorize(),
					winston.format.timestamp(),
					logFormat
				)
			})
		]
	});
};
