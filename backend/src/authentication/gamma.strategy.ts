import { Authority, GammaGroup } from '../models/gammaModels.js';
import Strategy from './strategy.js';
import passport from 'passport';
import { GammaUser } from '../models/gammaModels.js';

const default_options = {
	authorizationURL: 'http://localhost:8081/api/oauth/authorize',
	tokenURL: 'http://localhost:8081/api/oauth/token',
	profileURL: 'http://localhost:8081/api/users/me',
	clientID: 'id',
	clientSecret: 'secret',
	callbackURL: 'http://localhost:3001/auth/account/callback'
};

const isAdmin = (
	authorities: Authority[],
	gammaGroups: GammaGroup[]
): boolean => {
	const superGroups = gammaGroups.map((g) => g.superGroup?.name);

	if (process.env.MOCK && superGroups.includes('superadmin')) return true;

	//TODO: Get side admin groups from env?
	if (superGroups.includes('digit')) return true;

	for (const i in authorities) {
		if (authorities[i].authority == process.env.ADMIN_AUTHORITY) return true;
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
			const groups = profile.groups.filter(
				(g) => g.superGroup?.type != 'ALUMNI'
			);

			cb(
				null,
				{
					...profile,
					groups,
					isSiteAdmin: isAdmin(profile.authorities, groups),
					language: profile.language ?? 'en'
				},
				null
			);
		}
	);

	passport.use(strategy);

	passport.deserializeUser(async (user: Express.User, cb) => {
		return cb(null, user);
	});

	passport.serializeUser((user: Express.User, cb) => {

		cb(null, user);
	});
};
