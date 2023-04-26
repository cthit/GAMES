import { prisma } from '../prisma.js';

export enum BorrowStatus {
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
	if (borrowStatus == BorrowStatus.NotBorrowed) {
		await prisma.borrow.create({
			data: {
				gameId,
				user,
				borrowStart,
				borrowEnd
			}
		});
	}
	return borrowStatus;
};

export const returnGame = async (gameId: string, user: string) => {
	const borrowStatus = await controlBorrowStatus(gameId, user);
	if (borrowStatus == BorrowStatus.Borrowed) {

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
	}
	return borrowStatus;
};

export const listBorrows = async () => {
	const borrows = await prisma.borrow.findMany({
		select: {
			game: {
				select: {
					name: true,
				}
			},
			user: true,
			borrowStart: true,
			borrowEnd: true,
			returned: true
		}
	});
	return borrows;
}


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