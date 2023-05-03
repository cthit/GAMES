import { Prisma } from '@prisma/client';
import { GammaUser } from '../models/gammaModels.js';
import { prisma } from '../prisma.js';

export const createAccount = async (cid: string) => {
	try {
		await prisma.$transaction(async (tx) => {
			const user = await tx.user.create({
				data: {
					cid
				}
			});

			await tx.gameOwner.create({
				data: {
					ownerId: user.id,
					ownerType: 'USER'
				}
			});
		});
	} catch (e: any) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === 'P2002') {
				return false;
			}
			throw e;
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

	await Promise.all(
		orgsToAddUserAsMember.map(async (org) => {
			prisma.organizationMember.create({
				data: {
					userId: account.id,
					organizationId: org.id,
					addedFromGamma: true
				}
			});
		})
	);

	const orgsToSetUserAsAdmin = await prisma.organization.findMany({
		where: {
			AND: [
				{ OR: superGroupQueries },
				{ addGammaAsOrgAdmin: true },
				{
					members: {
						none: {
							isAdmin: true
						}
					}
				}
			]
		}
	});

	await Promise.all(
		orgsToSetUserAsAdmin.map(async (org) => {
			prisma.organizationMember.update({
				where: {
					organizationId_userId: {
						organizationId: org.id,
						userId: account.id
					}
				},
				data: {
					isAdmin: true
				}
			});
		})
	);
};
