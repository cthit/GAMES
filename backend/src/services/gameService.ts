import { prisma } from '../prisma.js';

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
			borrow: true, // TODO: See what is given
			playerMin: true,
			playerMax: true,
			rating: true,
			location: true,
			gameOwnerId: true
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
			borrow: true,
			location: true,
			gameOwnerId: true
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
		contains: string;
		mode: 'insensitive';
	};
	dateReleased?: {
		lte?: Date;
		gte?: Date;
	};
	playerMax?: {
		gte: number;
	};
	playerMin?: {
		lte: number;
	};
	platform?: {
		name: string
	},
	playtimeMinutes?: {
		lte?: number,
		gte?: number
	}
	location?: {
		contains: string;
		mode: 'insensitive';
	};
	gameOwnerId?: string;
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
			borrow: true,
			rating: true,
			location: true,
			gameOwnerId: true,
			playStatus: true
		},
		where: filter
	});
};

export const removeGame = async (gameID: string, gameOwnerId: string) => {
	const game = await prisma.game.findUnique({
		where: {
			id: gameID
		},
		select: {
			borrow: true,
			GameOwner: true
		}
	});
	if (!game) throw new Error('Game not found');
	if (game.GameOwner?.id != gameOwnerId) {
		throw new Error('User does not own this game');
	}
	const borrows = game.borrow.filter(
		(borrow) => !borrow.returned && borrow.borrowStart < new Date()
	);
	if (borrows.length > 0) throw new Error('Game is currently borrowed');

	return await prisma.game.delete({
		where: {
			id: gameID
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
}