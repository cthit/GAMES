import { prisma } from '../prisma.js';
import { getFromCache, setCache } from './cacheService.js';

export const createRating = async (
    game: string,
    userCid: string,
    rating: number,
) => {
    let user = await prisma.user.findFirst({
        where: {
            cid: userCid
        },
        select: {
            id: true
        }
    });
    if (!user) {
        return null;
    }
    let userId = user.id;
    await prisma.rating.upsert({
        where: {
            userId_gameId: {
                gameId: game,
                userId: userId
            }
        },
        update: {
            rating: rating
        },
        create: {
            gameId: game,
            userId: userId,
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
    let rating = await getFromCache(`rating:${game}`);
    if (rating) return rating;

    rating = await prisma.rating.aggregate({
        where: {
            gameId: game
        },
        _avg: {
            rating: true
        }
    });

    await setCache(`rating:${game}`, rating);
    return rating;
}
