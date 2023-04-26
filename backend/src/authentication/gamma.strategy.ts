import passport from 'passport';
import { GammaUser } from '../models/gammaUser.js';
import Strategy, { Authority } from './strategy.js';

const default_options = {
	authorizationURL: 'http://localhost:8081/api/oauth/authorize',
	tokenURL: 'http://localhost:8081/api/oauth/token',
	profileURL: 'http://localhost:8081/api/users/me',
	clientID: 'id',
	clientSecret: 'secret',
	callbackURL: 'http://localhost:3001/auth/account/callback'
};

const isAdmin = (authorities: Authority[], groups: String[]): boolean => {
	if (process.env.MOCK && groups.includes('superadmin')) {
		return true;
	}
	for (const i in authorities) {
		if (authorities[i].authority == process.env.ADMIN_AUTHORITY) {
			return true;
		}
	}

	return false;
};

export const init = (pass: passport.PassportStatic) => {
	const strategy = new Strategy(
		{
			authorizationURL: process.env.GAMMA_AUTH_URL || '',
			tokenURL: process.env.GAMMA_TOKEN_URL || '',
			profileURL: process.env.GAMMA_USER_URL || '',
			clientID: process.env.GAMMA_CLIENT_ID || '',
			clientSecret: process.env.GAMMA_CLIENT_SECRET || '',
			callbackURL: process.env.GAMMA_CALLBACK_URL || ''
		},
		(accessToken, profile, cb: (_: any, __: GammaUser, ___: any) => void) => {
			const groups = profile.groups
				.filter((g) => g.superGroup.type != 'ALUMNI')
				.map((g) => g.superGroup.name);
			groups.push(profile.cid);
			cb(
				null,
				{
					cid: profile.cid,
					phone: profile.phone,
					is_admin: isAdmin(profile.authorities, groups),
					groups: groups,
					language: profile.language ?? 'en',
					accessToken: accessToken
				},
				null
			);
		}
	);
	passport.use(strategy);
	passport.deserializeUser(async (user: Express.User, cb) => {
		return cb(null, user);
	});
	passport.serializeUser(function (user: Express.User, cb) {
		cb(null, user);
	});
};
