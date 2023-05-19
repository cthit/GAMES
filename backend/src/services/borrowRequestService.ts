import { prisma } from '../prisma.js';
import { BorrowStatus } from '@prisma/client';
import { InternalBorrowStatus } from './borrowService.js';
import { getAccountFromCid } from './accountService.js';
import { User } from '@prisma/client';

export enum BorrowState {
	Success,
	Free,
	Responded,
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

	const borrowRequestStatus = await controlBorrowValidity(
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
	borrowId: string,
	approved: boolean
) => {
	let borrow = await getBorrowById(borrowId);
	if (borrow === null) return BorrowState.NotValid;

	if (borrow.status != BorrowStatus.PENDING) return BorrowState.Responded;

	if (approved) {
		const borrowState = await controlBorrowValidity(
			borrow.gameId,
			borrow.borrowStart,
			borrow.borrowEnd
		);

		if (borrowState != BorrowState.Free) return borrowState;
	}

	await prisma.borrow.updateMany({
		where: {
			gameId: borrow.gameId,
			borrowStart: borrow.borrowStart,
			borrowEnd: borrow.borrowEnd
		},
		data: {
			status: approved ? BorrowStatus.ACCEPTED : BorrowStatus.REJECTED
		}
	});

	let borrowRequest = await prisma.borrow.findFirst({
		where: {
			gameId: borrow.gameId,
			borrowStart: borrow.borrowStart,
			borrowEnd: borrow.borrowEnd
		}
	});
	if (borrowRequest === null) return BorrowState.NotValid;

	return BorrowState.Success;
};

export const getActiveBorrowRequests = async (account: User) => {
	const organizationMemberships = await prisma.organizationMember.findMany({
		//Get all the orgz where login is admin
		where: {
			userId: account.id,
			isAdmin: true
		},
		select: {
			organizationId: true
		}
	});

	const organizationIds = organizationMemberships.map(
		(membership) => membership.organizationId
	);

	const borrowRequests = await prisma.borrow.findMany({
		where: {
			status: BorrowStatus.PENDING,

			OR: [
				{
					game: {
						//Get requests for games in orgz where login is admin
						GameOwner: {
							ownerType: 'ORGANIZATION',
							ownerId: {
								in: organizationIds
							}
						}
					}
				},
				{
					game: {
						//Get requests for games login owns
						GameOwner: {
							ownerType: 'USER',
							ownerId: account.id
						}
					}
				}
			]
		},
		include: {
			game: {
				select: {
					name: true
				}
			}
		}
	});
	return borrowRequests;
};

const getBorrowById = async (borrowId: string) => {
	const borrowData = await prisma.borrow.findFirst({
		where: {
			id: borrowId
		}
	});
	return borrowData;
};

const controlBorrowValidity = async (
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

	return BorrowState.Free;
};
