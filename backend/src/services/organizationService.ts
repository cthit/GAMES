import { prisma } from '../prisma.js';

export const getOrganizationsIdsAndNames = async () => {
	return await prisma.organization.findMany({
		select: {
			id: true,
			name: true
		}
	});
};

export const getOrganizationWithMembers = async (id: string) => {
	return await prisma.organization.findUnique({
		where: {
			id: id
		},
		include: {
			members: {}
		}
	});
};

export const getOrganization = async (id: string) => {
	return await prisma.organization.findUnique({
		where: {
			id: id
		}
	});
};

export const addOrganization = async (
	name: string,
	gammaSuperGroups: string[],
	addGammaAsOrgAdmin: boolean
) => {
	await prisma.organization.create({
		data: {
			name: name,
			gammaSuperNames: gammaSuperGroups,
			addGammaAsOrgAdmin: addGammaAsOrgAdmin
		}
	});
};

export const removeOrganization = async (id: string) => {
	await prisma.organization.delete({
		where: {
			id: id
		}
	});
};

export const updateOrganization = async (
	id: string,
	name: string,
	gammaSuperGroups: string[],
	addGammaAsOrgAdmin: boolean
) => {
	await prisma.organization.update({
		where: {
			id: id
		},
		data: {
			name: name,
			gammaSuperNames: gammaSuperGroups,
			addGammaAsOrgAdmin: addGammaAsOrgAdmin
		}
	});
};

export const addOrganizationMember = async (
	orgId: string,
	accountId: string
) => {
	await prisma.organizationMember.create({
		data: {
			organizationId: orgId,
			userId: accountId
		}
	});
};

export const removeOrganizationMember = async (
	orgId: string,
	accountId: string
) => {
	await prisma.organizationMember.delete({
		where: {
			organizationId_userId: {
				organizationId: orgId,
				userId: accountId
			}
		}
	});
};

export const addOrganizationAdmin = async (
	orgId: string,
	accountId: string
) => {
	await prisma.organizationMember.update({
		where: {
			organizationId_userId: {
				organizationId: orgId,
				userId: accountId
			}
		},
		data: {
			isAdmin: true
		}
	});
};

export const removeOrganizationAdmin = async (
	orgId: string,
	accountId: string
) => {
	await prisma.organizationMember.update({
		where: {
			organizationId_userId: {
				organizationId: orgId,
				userId: accountId
			}
		},
		data: {
			isAdmin: true
		}
	});
};
