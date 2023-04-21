import { Router } from 'express';
import express from 'express';
import passport from 'passport';

import { GammaUser } from '../models/gammaUser.js';
import { createAccount } from '../services/accountService.js';

const authRouter = Router();

authRouter.get('/login', passport.authenticate('gamma'));
authRouter.get(
	'/callback',
	passport.authenticate('gamma'),
	async (req: express.Request, res: express.Response) => {

		const user: GammaUser = {
			cid: '',
			is_admin: false,
			groups: [],
			language: 'en',
			...req.user
		};
        delete user.accessToken;

        if (await createAccount(user.cid)){
            console.log("Created account for " + user.cid);
        }else{
            console.log("Account already exists for " + user.cid);
        }


        res.status(200).json(user);
	}
);
authRouter.post('/logout', (req: express.Request, res: express.Response) => {
	req.logOut((err) => {
		// TODO: Better error handling
		if (err) {
			console.log(err);
			res.status(500).json({ message: 'Error logging out'});
			return;
		}
		res.status(200).json({ message: 'Logged out'});
		res.status(200);
	});
});

authRouter.get('/user', (req: express.Request, res: express.Response) => {
    if (req.isAuthenticated()) {
        const user: GammaUser = {
            cid: '',
            is_admin: false,
            groups: [],
            language: 'en',
            ...req.user
        };
        delete user.accessToken;
        res.status(200).json(user);
    } else {
        res.status(401).json({ message: 'Not logged in'});
    }
});

export default authRouter;
