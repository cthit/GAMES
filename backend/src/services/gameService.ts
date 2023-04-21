import { prisma } from '../prisma.js';

export const createGame = async (
	name: string,
	description: string,
	platform: string,
	releaseDate: Date,
	playtimeMinutes: number
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
			playtimeMinutes
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
			borrow: true
		}
	});
};

export const borrowGame = async (gameId: string, user: string) => {
	await prisma.game.update({
		where: {
			id: gameId
		},
		data: {
			borrow: {
				push: {
					gameId: gameId,
					user: user
				}
			}
		}
	});
};

export const returnGame = async (gameId: string, user: string) => {
	await prisma.game.update({
		where: {
			id: gameId
		},
		data: {
			borrow: {
				updateMany: {
					where: {
						gameId: gameId
					},
					data: {
						returned: true
					}
				}
			}
		}
	});
};