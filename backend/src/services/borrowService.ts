import { prisma } from '../prisma.js';
import { BorrowRequestStatus } from '@prisma/client';
import { getAccountFromCid } from './accountService.js';

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
		const gammaUser = await getAccountFromCid(user);
		const userId = gammaUser!.id;
		await prisma.borrowRequest.create({
			data: {
				gameId,
				userId,
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
				request: {
					updateMany: {
						where: {
							gameId: gameId,
							status: BorrowRequestStatus.BORROWED
						},
						data: {
							status: BorrowRequestStatus.RETURNED
						}
					}
				}
			}
		});
	}
	return borrowStatus;
};

export const listBorrows = async () => {
	const borrows = await prisma.borrowRequest.findMany({
		select: {
			game: {
				select: {
					name: true
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

const controlBorrowStatus = async (gameId: string, user: string) => {
	const data = await prisma.game.findUnique({
		where: {
			id: gameId
		},
		select: {
			request: true
		}
	});
	if (data === null) return BorrowStatus.NotValid;
	const isBorrowed =
		data.request.filter((b: { status: BorrowRequestStatus }) => {
			return (b.status = BorrowRequestStatus.BORROWED);
		}).length > 0;
	if (isBorrowed) return BorrowStatus.Borrowed;
	return BorrowStatus.NotBorrowed;
};
