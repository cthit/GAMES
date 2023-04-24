import { GammaGroup } from './gammaGroup.js';

export interface GammaUser {
	cid: string;
	nick: string;
	firstName: string;
	lastName: string;

	email: string;
	phone: string;
	avatarUrl?: string;
	acceptanceYear: number;
	gdpr: boolean;
	language: string;
	authorities: [{ id: string; authority: string }];
	groups: GammaGroup[];
	websiteURLs?: string;
	//Internal extension
	isSiteAdmin: boolean;
	accessToken?: string;
}
