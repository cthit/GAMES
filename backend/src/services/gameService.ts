import { prisma } from '../prisma.js';

export const createGame = async (
	name: string,
	description: string,
	platform: string,
	releaseDate: Date,
	playtimeMinutes: number,
	playerMin: number,
	playerMax: number
) => {
	await prisma.game.create({
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
			playerMax
		}
	});
};

export const getAllGames = async () => {
	return await prisma.game.findMany({
		select: {
			id: true,
			name: true,
			description: true,
			platformName: true,
			dateReleased: true,
			playtimeMinutes: true,
			borrow: true, // TODO: See what is given
			playerMin: true,
			playerMax: true
		}
	});
};

export const searchGames = async (term: string) => {
	return await prisma.game.findMany({
		select: {
			id: true,
			name: true,
			description: true,
			platformName: true,
			dateReleased: true,
			playtimeMinutes: true,
			playerMin: true,
			playerMax: true,
			borrow: true
		},
		where: {
			name: {
				contains: term,
				mode: 'insensitive'
			}
		}
	});
};


export const filterGames = async (filter: any) => {
	const filterQuery = {
		dateReleased: {
			lte: filter.releaseBefore,
			gte: filter.releaseAfter
		},
		playerCount: {
			gte: filter.playerCount
		},
		platform: (filter.platform) ? filter.platform : undefined,
		playtime: (filter.playerCount) ? filter.playerCount : undefined
	};

	return await prisma.game.findMany({
		select: {
			id: true,
			name: true,
			description: true,
			platformName: true,
			dateReleased: true,
			playtimeMinutes: true,
			playerMin: true,
			playerMax: true,
			borrow: true
		},
		where: filterQuery
	});
};