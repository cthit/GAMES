import { Prisma } from '@prisma/client';
import { prisma } from '../prisma.js';
import { GammaUser } from '../models/gammaModels.js';

export const createAccount = async (cid: string) => {
	try {
		await prisma.user.create({
			data: {
				cid
			}
		});
	} catch (e: any) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === 'P2002') {
				return false;
			}
		}
	}
	return true;
};

export const getAccountFromCid = async (cid: string) => {
	return await prisma.user.findUnique({
		where: {
			cid: cid
		}
	});
};

export const getAccountFromId = async (id: string) => {
	return await prisma.user.findUnique({
		where: {
			id: id
		}
	});
};

export const addUserToGammaConnectedOrgs = async (user: GammaUser) => {
	const account = await getAccountFromCid(user.cid);

	if (!account) return; //TODO: Handle this error

	const superGroupQueries = user.groups.map((g) => ({
		gammaSuperNames: {
			has: g.superGroup?.name
		}
	}));

	const orgsToAddUserAsMember = await prisma.organization.findMany({
		where: {
			AND: [
				{ OR: superGroupQueries },
				{
					members: {
						none: {
							userId: account.id
						}
					}
				}
			]
		},
		select: {
			id: true
		}
	});

	for (const org of orgsToAddUserAsMember) {
		await prisma.organizationMember.create({
			data: {
				userId: account.id,
				organizationId: org.id,
				addedFromGamma: true
			}
		});
	}

	const orgsToAddUserAsAdmin = await prisma.organization.findMany({
		where: {
			AND: [
				{ OR: superGroupQueries },
				{ addGammaAsOrgAdmin: true },
				{
					admins: {
						none: {
							userId: account.id
						}
					}
				}
			]
		}
	});

	for (const org of orgsToAddUserAsAdmin) {
		await prisma.organizationMember.create({
			data: {
				userId: account.id,
				organizationId: org.id,
				addedFromGamma: true
			}
		});
	}
};
