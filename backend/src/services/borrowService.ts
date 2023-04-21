import { prisma } from '../prisma.js';

export const borrowGame = async (
	gameId: string,
	user: string,
	borrowStart: Date,
	borrowEnd: Date
) => {
	await prisma.borrow.create({
		data: {
			gameId,
			user,
			borrowStart,
			borrowEnd
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
