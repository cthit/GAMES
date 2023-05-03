import { GameOwnerType } from '@prisma/client';
import { prisma } from '../prisma.js';
import { getAccountFromCid, getAccountFromId } from './accountService.js';
import { getFromCache, setCache } from './cacheService.js';
import { getGammaUser } from './gammaService.js';

export const getGameOwnerIdFromCid = async (cid: string) => {
	const user = await getAccountFromCid(cid);
	if (!user) throw new Error('User does not exist');

	const gameOwner = await getGameOwnerFromIdAndType(user.id, 'USER');
	if (!gameOwner) throw new Error('User does not have associated gameOwner');

	return gameOwner.id;
};

export const getGameOwnerNameFromId = async (gameOwnerId: string) => {
	const cachedName = await getFromCache('nick-gameOwner-' + gameOwnerId);
	if (cachedName) return cachedName as string;

	const user = await getUserFromGameOwner(gameOwnerId);

	if (!user?.cid) throw new Error('No CID exists for the given user.');

	const gammaUser = await getGammaUser(user.cid);

	const HOUR = 60;
	setCache('nick-gameOwner-' + gameOwnerId, gammaUser.nick, HOUR); // nick prefix to avoid collisions with other cache keys

	return gammaUser.nick;
};

const getUserFromGameOwner = async (gameOwnerId: string) => {
	const gameOwner = await prisma.gameOwner.findUnique({
		where: {
			id: gameOwnerId
		}
	});

	if (gameOwner?.ownerType !== 'USER')
		throw new Error('The given gameOwner does not correspond to a user.');

	return getAccountFromId(gameOwner.ownerId);
};

const getGameOwnerFromIdAndType = async (id: string, type: GameOwnerType) => {
	return await prisma.gameOwner.findUnique({
		where: {
			ownerId_ownerType: {
				ownerId: id,
				ownerType: type
			}
		}
	});
};
