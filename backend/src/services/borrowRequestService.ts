import { prisma } from '../prisma.js';
import { BorrowRequestStatus } from '@prisma/client';
import { BorrowStatus } from './borrowService.js';

export enum BorrowRequestState {
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
    if (borrowStart < new Date(new Date().toDateString())) return BorrowRequestState.InPast;
    if (borrowEnd < borrowStart) return BorrowRequestState.Inverted;
    const borrowRequestStatus = await controlBorrowRequestStatus(gameId, borrowStart, borrowEnd);
    if (borrowRequestStatus == BorrowRequestState.Free) {
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
    borrowStart: Date,
    borrowEnd: Date,
    approved: boolean
) => {
    let borrowRequestStatus = await controlBorrowRequestStatus(gameId, borrowStart, borrowEnd);
    if (borrowRequestStatus == BorrowRequestState.Pending) {
        await prisma.borrowRequest.updateMany({
            where: {
                gameId: gameId,
                borrowStart: borrowStart,
                borrowEnd: borrowEnd
            },
            data: {
                status: approved ? BorrowRequestStatus.ACCEPTED : BorrowRequestStatus.REJECTED
            }
        });
        borrowRequestStatus = approved ? BorrowRequestState.Approved : BorrowRequestState.Rejected;
        let borrowRequest = await prisma.borrowRequest.findFirst({
            where: {
                gameId: gameId,
                borrowStart: borrowStart,
                borrowEnd: borrowEnd
            }
        })
        if (borrowRequest === null) return BorrowRequestState.NotValid;
    }
    return borrowRequestStatus;
}

// TODO: Only get requests for game manager once implemented
/**export const getActiveBorrowRequests = async () => {
    return await prisma.borrowRequest.findMany({
        where: {
            status: BorrowRequestStatus.PENDING
        },
        include: {
            game: {
                select: {
                    name: true
                }
            }
        }
    });
}
**/

export const getActiveBorrowRequests = async (userIds : string) => {
  const organizationMemberships = await prisma.organizationMember.findMany({ //Get all the orgz where login is admin
    where: {
      userId : userIds,
      isAdmin: true,
    },
    select: {
      organizationId: true,
    },
  });

  const organizationIds = organizationMemberships.map(
    (membership) => membership.organizationId
  );

  const borrowRequests = await prisma.borrowRequest.findMany({
    where: {
      status: BorrowRequestStatus.PENDING,
      OR: [
        {
            game: { //Get requests for games in orgz where login is admin
                GameOwner: {
                    ownerType: "ORGANIZATION",
                    ownerId: {
                        in: organizationIds,
                    },
                },
            },
        }, 
        {
            game: { //Get requests for games login owns
                GameOwner: {
                  ownerType: "USER",
                  ownerId: userIds,
                },
              },
        },
      ],
    },          
    include: {
      game: {
        select: {
          name: true,
        },
      },
    },
  });

  return borrowRequests;
};

const controlBorrowRequestStatus = async (gameId: string, borrowStart: Date, borrowEnd: Date) => {
    const gameData = await prisma.game.findFirst({
        where: {
            id: gameId
        }
    });
    if (gameData === null)
        return BorrowRequestState.NotValid;

	const data = await prisma.borrowRequest.findFirst({
		where: {
			gameId: gameId,
            borrowStart: borrowStart,
            borrowEnd: borrowEnd
		}
	});
	if (data === null) {
        const rangeData = await prisma.borrowRequest.findMany({
            where: {
                gameId: gameId,
                borrowStart: {
                    lte: borrowEnd
                },
                borrowEnd: {
                    gte: borrowStart
                },
                status: BorrowRequestStatus.ACCEPTED
            }
        });
        if (rangeData.length > 0)
		    return BorrowRequestState.Overlapping;
        else return BorrowRequestState.Free;
    }
        
    switch(data.status) {
        case BorrowRequestStatus.PENDING:
            return BorrowRequestState.Pending;
        case BorrowRequestStatus.REJECTED:
            return BorrowRequestState.Rejected;
        case BorrowRequestStatus.ACCEPTED:
            return BorrowRequestState.Approved;
    }
}
