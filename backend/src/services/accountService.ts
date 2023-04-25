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

export const getAccount = async (cid: string) => {
	return await prisma.user.findUnique({
		where: {
			cid: cid
		}
	});
};

export const addUserToGammaConnectedOrgs = async (user: GammaUser) => {
	const account = await getAccount(user.cid);

	if (!account) return; //TODO: Handle this error

	const superGroupQueries = user.groups.map((g) => ({
		gammaSuperNames: {
			has: g.superGroup?.name
		}
	}));

	const orgsToAddUserAsMember = await prisma.organization.findMany({
		where: {
			AND: [{ OR: superGroupQueries }, { members: { none: account } }]
		},
		select: {
			id: true
		}
	});

	for (const org of orgsToAddUserAsMember) {
		await prisma.organization.update({
			where: {
				id: org.id
			},
			data: {
				members: {
					connect: {
						id: account.id
					}
				}
			}
		});
	}

	const orgsToAddUserAsAdmin = await prisma.organization.findMany({
		where: {
			AND: [
				{ OR: superGroupQueries },
				{ addGammaAsOrgAdmin: true },
				{ admins: { none: account } }
			]
		}
	});

	for (const org of orgsToAddUserAsAdmin) {
		await prisma.organization.update({
			where: {
				id: org.id
			},
			data: {
				admins: {
					connect: {
						id: account.id
					}
				}
			}
		});
	}
};
