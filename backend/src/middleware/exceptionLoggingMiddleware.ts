import { NextFunction, Request, Response } from 'express';
import winston from 'winston';

export const logExceptions = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	winston.error(err.message, { stacktrace: err.stack });
	return res.status(500).json({ message: 'Something went wrong' });
};
