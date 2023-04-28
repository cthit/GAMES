import { NextFunction, Request, Response } from 'express';
import { GammaUser } from '../models/gammaModels.js';

export const isAuthenticated = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.status(401).json({ message: 'Not logged in' });
};

export const isSiteAdmin = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user as GammaUser;
	if (user?.isSiteAdmin) {
		return next();
	}
	return res.status(403).json({ message: 'Forbidden' });
};
