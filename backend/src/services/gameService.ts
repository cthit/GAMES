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

export type Filter = {
	name?: {
		contains: string,
		mode: 'insensitive'
	},
	dateReleased?: {
		lte: Date,
		gte: Date
	},
	playerMax?: {
		gte: number
	},
	playerMin?: {
		lte: number
	},
	platform?: {
		name: string
	},
	playtime?: number
};
export const filterGames = async (filter: Filter) => {
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
		where: filter
	});
};