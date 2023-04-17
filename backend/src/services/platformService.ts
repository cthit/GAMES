import { prisma } from '../prisma.js';

export const platformExists = async (platform: string): Promise<boolean> => {
	if (
		await prisma.platform.findUnique({
			where: {
				name: platform
			}
		})
	) {
		return true;
	}

	return false;
};

export const getAllPlatforms = async () => {
	return await prisma.platform.findMany({ select: { name: true } });
};
