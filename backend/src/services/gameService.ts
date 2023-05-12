import { BorrowRequestStatus } from '@prisma/client';
import { prisma } from '../prisma.js';

export interface Filter {
	search?: string | undefined;
	releaseBefore?: Date | undefined;
	releaseAfter?: Date | undefined;
	playerMax?: number | undefined;
	playerMin?: number | undefined;
	platform?: string | undefined;
	playtimeMin?: number | undefined;
	playtimeMax?: number | undefined;
	location?: string | undefined;
	gameOwnerId?: string | undefined;
}

export const searchAndFilterGames = async (filter?: Filter) => {
	return await prisma.game.findMany({
		where: {
			name: {
				contains: filter?.search,
				mode: 'insensitive'
			},
			dateReleased: {
				lte: filter?.releaseBefore,
				gte: filter?.releaseAfter
			},
			playerMax: {
				gte: filter?.playerMax
			},
			playerMin: {
				lte: filter?.playerMin
			},
			platformName: {
				contains: filter?.platform,
				mode: 'insensitive'
			},
			playtimeMinutes: {
				gte: filter?.playtimeMin,
				lte: filter?.playtimeMax
			},
			location: {
				contains: filter?.location,
				mode: 'insensitive'
			},
			gameOwnerId: {
				equals: filter?.gameOwnerId
			}
		},
		include: {
			request: {}
		}
	});
};

export const createGame = async (
	name: string,
	description: string,
	platform: string,
	releaseDate: Date,
	playtimeMinutes: number,
	playerMin: number,
	playerMax: number,
	location: string,
	gameOwnerId: string
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
			playerMax,
			location,
			GameOwner: {
				connect: {
					id: gameOwnerId
				}
			}
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
			request: true, // TODO: See what is given
			playerMin: true,
			playerMax: true,
			rating: true,
			location: true,
			gameOwnerId: true
		}
	});
};

export const getGameById = async (gameId: string) => {
	return await prisma.game.findUnique({
		where: {
			id: gameId
		}
	});
};

export const removeGame = async (gameId: string) => {
	const game = await prisma.game.findUnique({
		where: {
			id: gameId
		},
		select: {
			request: true,
			GameOwner: true
		}
	});

	if (!game) throw new Error('Game not found');
	if (game.GameOwner?.id != gameOwnerId) {
		throw new Error('User does not own this game');
	}
	const borrows = game.request.filter(
		(request) =>
			request.status === BorrowRequestStatus.BORROWED &&
			request.borrowStart < new Date()
	);

	if (borrows.length > 0) throw new Error('Game is currently borrowed');

	await prisma.game.delete({
		where: {
			id: gameId
		}
	});
};

export const markGameAsPlayed = async (gameID: string, cid: string) => {
	const user = await prisma.user.findUnique({
		where: {
			cid: cid
		}
	});
	if (!user) throw new Error('User not found');
	await prisma.playStatus.create({
		data: {
			gameId: gameID,
			userId: user.id
		}
	});
};
