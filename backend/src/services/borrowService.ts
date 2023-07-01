import { prisma } from '../prisma.js';
import { BorrowStatus } from '@prisma/client';
import { getAccountFromCid } from './accountService.js';

export enum InternalBorrowStatus {
	Borrowed,
	NotBorrowed,
	NotValid
}

export const borrowGame = async (
	gameId: string,
	borrowStart: Date,
	borrowEnd: Date,
	userId: string
) => {
	const borrowStatus = await controlBorrowStatus(gameId);

	if (borrowStatus == InternalBorrowStatus.NotBorrowed) {
		await prisma.borrow.create({
			data: {
				gameId,
				userId,
				borrowStart,
				borrowEnd,
				status: BorrowStatus.BORROWED
			}
		});
	}

	return borrowStatus;
};

export const returnGame = async (gameId: string, user: string) => {
	const borrowStatus = await controlBorrowStatus(gameId);
	if (borrowStatus == InternalBorrowStatus.Borrowed) {
		await prisma.game.update({
			where: {
				id: gameId
			},
			data: {
				borrow: {
					updateMany: {
						where: {
							gameId: gameId,
							status: BorrowStatus.BORROWED
						},
						data: {
							status: BorrowStatus.RETURNED
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
			status: true
		}
	});
	return borrows;
};

export const listOwnGameBorrows = async (ownerId: string) => {
	const borrows = await prisma.borrow.findMany({
		where: {
			game: {
				gameOwnerId: ownerId
			}
		},
		select: {
			game: {
				select: {
					name: true,

				}
			},
			user: true,
			borrowStart: true,
			borrowEnd: true,
			status: true
		}
	});
	return borrows;
};

const controlBorrowStatus = async (gameId: string) => {
	const data = await prisma.game.findUnique({
		where: {
			id: gameId
		},
		select: {
			borrow: true
		}
	});
	if (data === null) return InternalBorrowStatus.NotValid;
	const isBorrowed =
		data.borrow.filter((b: { status: BorrowStatus }) => {
			return b.status === BorrowStatus.BORROWED;
		}).length > 0;
	if (isBorrowed) return InternalBorrowStatus.Borrowed;
	return InternalBorrowStatus.NotBorrowed;
};
