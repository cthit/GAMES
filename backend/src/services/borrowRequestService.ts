import { prisma } from '../prisma.js';
import { BorrowRequestStatus } from '@prisma/client';
import { BorrowStatus, borrowGame } from './borrowService.js';

export enum BorrowRequestState {
    Pending,
    Approved,
    Rejected,
    Overlapping,
    NotValid
}

export const createBorrowRequest = async (
    gameId: string,
    user: string,
    borrowStart: Date,
    borrowEnd: Date
) => {
    const borrowRequestStatus = await controlBorrowRequestStatus(gameId, user);
    if (borrowRequestStatus == BorrowRequestState.Pending) {
        await prisma.borrowRequest.create({
            data: {
                gameId,
                user,
                borrowStart,
                borrowEnd
            }
        });
    }
    return borrowRequestStatus;
};

export const respondBorrowRequest = async (
    gameId: string,
    user: string,
    approved: boolean
) => {
    let borrowRequestStatus = await controlBorrowRequestStatus(gameId, user);
    if (borrowRequestStatus == BorrowRequestState.Pending) {
        await prisma.borrowRequest.updateMany({
            where: {
                gameId: gameId,
                user: user
            },
            data: {
                approved: prisma.BorrowRequestStatus.ACCEPTED
            }
        });
        borrowRequestStatus = approved ? BorrowRequestState.Approved : BorrowRequestState.Rejected;
        let borrowRequest = prisma.borrowRequest.find({
            where: {
                gameId: gameId,
                user: user
            }
        })
        if (approved) {
            await borrowGame(gameId, user, new Date(), new Date());
        }
    }
    return borrowRequestStatus;
}

const controlBorrowRequestStatus = async (gameId: string, user: string) => {
	const data = await prisma.game.findUnique({
		where: {
			id: gameId
		},
		select: {
			request: true
		}
	});
	if (data === null)
		return BorrowRequestState.NotValid;
	const isApproved = data.request.filter((b: { status: BorrowRequestStatus }) => {
		return b.status == BorrowRequestStatus.ACCEPTED;
	}).length > 0;
	if (isApproved)
		return BorrowRequestState.Approved;
	return BorrowRequestState.Pending;
}
