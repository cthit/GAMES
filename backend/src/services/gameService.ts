import { prisma } from '../prisma.js';

export const createGame = async (
	name: string,
	description: string,
	platform: string,
	releaseDate: Date,
	playtime: number
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
			playtime
		}
	});
};
