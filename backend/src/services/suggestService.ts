import { prisma } from '../prisma.js';

export const createSuggestion = async (
	name: string,
	description: string,
	platform: string,
	releaseDate: Date,
	playtimeMinutes: number,
	playerMin: number,
	playerMax: number,
	motivation: string
) => {
	await prisma.suggest.create({
		data: {
			name,
			description,
			platform: {
				connect: {
					name: platform
				}
			},
			dateReleased: releaseDate,
			playtimeMinutes,
			playerMin,
			playerMax,
			motivation
		}
	});
};

export const getAllSuggestions = async () => {
	return await prisma.suggest.findMany({
		select: {
			name: true,
			description: true,
			platformName: true,
			dateReleased: true,
			playtimeMinutes: true,
			playerMin: true,
			playerMax: true,
			motivation: true
		}
	});
};
