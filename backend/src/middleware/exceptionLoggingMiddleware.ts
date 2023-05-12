import { NextFunction, Request, Response } from 'express';
import winston from 'winston';

export const logExceptions = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!(err instanceof Error)) {
		winston.error(
			`Caught exception that was not of type error. Was of type "${typeof err}" with value: ${err}`
		);
	} else {
		winston.error(err.message, { stacktrace: err.stack });
	}
	return res.status(500).json({ message: 'Something went wrong' });
};
