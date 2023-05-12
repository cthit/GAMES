import { prisma } from '../prisma.js';
import { BorrowStatus } from '@prisma/client';
import { InternalBorrowStatus } from './borrowService.js';
import { getAccountFromCid } from './accountService.js';

export enum BorrowState {
	Pending,
	Approved,
	Rejected,
	Free,
	Overlapping,
	Inverted,
	InPast,
	NotValid
}

export const createBorrowRequest = async (
	gameId: string,
	user: string,
	borrowStart: Date,
	borrowEnd: Date
) => {
	if (borrowStart < new Date(new Date().toDateString()))
		return BorrowState.InPast;

	if (borrowEnd < borrowStart) return BorrowState.Inverted;

	const borrowRequestStatus = await controlBorrowRequestStatus(
		gameId,
		borrowStart,
		borrowEnd
	);

	const gammaUser = await getAccountFromCid(user);

	const userId = gammaUser!.id;

	if (borrowRequestStatus == BorrowState.Free) {
		await prisma.borrow.create({
			data: {
				gameId,
				userId,
				borrowStart,
				borrowEnd
			}
		});
	}

	return borrowRequestStatus;
};

export const respondBorrowRequest = async (
	gameId: string,
	borrowStart: Date,
	borrowEnd: Date,
	approved: boolean
) => {
	let borrowRequestStatus = await controlBorrowRequestStatus(
		gameId,
		borrowStart,
		borrowEnd
	);
	if (borrowRequestStatus == BorrowState.Pending) {
		await prisma.borrow.updateMany({
			where: {
				gameId: gameId,
				borrowStart: borrowStart,
				borrowEnd: borrowEnd
			},
			data: {
				status: approved ? BorrowStatus.ACCEPTED : BorrowStatus.REJECTED
			}
		});
		borrowRequestStatus = approved
			? BorrowState.Approved
			: BorrowState.Rejected;
		let borrowRequest = await prisma.borrow.findFirst({
			where: {
				gameId: gameId,
				borrowStart: borrowStart,
				borrowEnd: borrowEnd
			}
		});
		if (borrowRequest === null) return BorrowState.NotValid;
	}
	return borrowRequestStatus;
};

// TODO: Only get requests for game manager once implemented
export const getActiveBorrowRequests = async () => {
	return await prisma.borrow.findMany({
		where: {
			status: BorrowStatus.PENDING
		},
		include: {
			game: {
				select: {
					name: true
				}
			}
		}
	});
};

const controlBorrowRequestStatus = async (
	gameId: string,
	borrowStart: Date,
	borrowEnd: Date
) => {
	const gameData = await prisma.game.findFirst({
		where: {
			id: gameId
		}
	});
	if (gameData === null) return BorrowState.NotValid;

	const data = await prisma.borrow.findFirst({
		where: {
			gameId: gameId,
			borrowStart: borrowStart,
			borrowEnd: borrowEnd
		}
	});
	if (data === null) {
		const rangeData = await prisma.borrow.findMany({
			where: {
				gameId: gameId,
				borrowStart: {
					lte: borrowEnd
				},
				borrowEnd: {
					gte: borrowStart
				},
				status: BorrowStatus.ACCEPTED
			}
		});
		if (rangeData.length > 0) return BorrowState.Overlapping;
		else return BorrowState.Free;
	}

	switch (data.status) {
		case BorrowStatus.PENDING:
			return BorrowState.Pending;
		case BorrowStatus.REJECTED:
			return BorrowState.Rejected;
		case BorrowStatus.ACCEPTED:
			return BorrowState.Approved;
	}
};
