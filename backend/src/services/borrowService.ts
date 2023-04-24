import { prisma } from '../prisma.js';

enum BorrowStatus {
	Borrowed,
	NotBorrowed,
	NotValid
}

export const borrowGame = async (
	gameId: string,
	user: string,
	borrowStart: Date,
	borrowEnd: Date
) => {
	const borrowStatus = await controlBorrowStatus(gameId, user);
	if (!(borrowStatus == BorrowStatus.NotBorrowed))
		throw new Error("The game doesn't exist or is already borrowed");
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
	const borrowStatus = await controlBorrowStatus(gameId, user);
	if (!(borrowStatus == BorrowStatus.Borrowed))
		throw new Error("The game doesn't exist or isn't borrowed");
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


const controlBorrowStatus = async (gameId: string, user: string) => {
	const data = await prisma.game.findUnique({
		where: {
			id: gameId
		},
		select: {
			borrow: true
		}
	});
	if (data === null)
		return BorrowStatus.NotValid;
	const isBorrowed = data.borrow.filter((b: { returned: boolean }) => {
		return !b.returned;
	}).length > 0;
	if (isBorrowed)
		return BorrowStatus.Borrowed;
	return BorrowStatus.NotBorrowed;
}