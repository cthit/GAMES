import { GameOwnerType } from '@prisma/client';
import { prisma } from '../prisma.js';
import { getAccountFromCid } from './accountService.js';

export const getGameOwnerIdFromCid = async (cid: string) => {
	const user = await getAccountFromCid(cid);
	if (!user) throw new Error('User does not exist');

	const gameOwner = await getGameOwnerFromIdAndType(user.id, 'USER');
	if (!gameOwner) throw new Error('User does not have associated gameOwner');

	return gameOwner.id;
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
