import { GameOwnerType } from '@prisma/client';
import { GammaUser } from '../models/gammaModels.js';
import { prisma } from '../prisma.js';
import { getAccountFromCid, getAccountFromId } from './accountService.js';
import { getFromCache, setCache } from './cacheService.js';
import { getGameById } from './gameService.js';
import { getGammaUser } from './gammaService.js';
import { getOrganization } from './organizationService.js';

export const getGameOwnerIdFromCid = async (cid: string) => {
	const user = await getAccountFromCid(cid);
	if (!user) throw new Error('User does not exist');

	const gameOwner = await getGameOwnerFromIdAndType(user.id, 'USER');
	if (!gameOwner) throw new Error('User does not have associated gameOwner');

	return gameOwner.id;
};

export const getGameOwnerById = async (gameOwnerId: string) => {
	return await prisma.gameOwner.findUnique({
		where: {
			id: gameOwnerId
		}
	});
};

export const getGameOwnerNameFromId = async (gameOwnerId: string) => {
	const cachedName = await getFromCache<string>(
		'name-gameOwner-' + gameOwnerId
	);
	if (cachedName) return cachedName;

	const gameOwner = await getGameOwnerById(gameOwnerId);

	if (!gameOwner) throw new Error('GameOwner does not exist');

	let name: string;
	if (gameOwner?.ownerType === 'USER') {
		const user = await getAccountFromId(gameOwner.ownerId);

		if (!user) throw new Error('User does not exist');

		const gammaUser = await getGammaUser(user.cid);

		name = gammaUser.nick;
	} else {
		const org = await getOrganization(gameOwner.ownerId);

		if (!org) throw new Error('Organization does not exist');

		name = org.name;
	}

	const HOUR = 60;
	setCache('name-gameOwner-' + gameOwnerId, name, HOUR); // Name prefix to avoid collisions with other cache keys

	return name;
};

export const getGameOwnersWithGames = async () => {
	return await prisma.gameOwner.findMany({
		where: {
			Games: {
				some: {}
			}
		}
	});
};

export const isGameOwner = async (user: GammaUser, gameId: string) => {
	const game = await getGameById(gameId);

	if (!game) return false;

	const gameOwner = await getGameOwnerIdFromCid(user.cid);

	return gameOwner === game.gameOwnerId;
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
