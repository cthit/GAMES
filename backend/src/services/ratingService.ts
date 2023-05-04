import { prisma } from '../prisma.js';

export const createRating = async (
    game: string,
    user: string,
    rating: number,
) => {
    await prisma.rating.upsert({
        where: {
            gameId: game,
            userId: user
        },
        update: {
            rating: rating
        },
        create: {
            gameId: game,
            userId: user,
            rating: rating
        }
    });
}

export const getUserRating = async (
    game: string,
    user: string,
) => {
    return await prisma.rating.findFirst({
        where: {
            gameId: game,
            userId: user
        }
    });
}

export const getAverageRating = async (
    game: string,
) => {
    return await prisma.rating.aggregate({
        where: {
            gameId: game
        },
        avg: {
            rating: true
        }
    });
}
