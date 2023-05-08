import { prisma } from '../prisma.js';
import { getFromCache, setCache } from './cacheService.js';
import { getAccountFromCid } from '../services/accountService.js';

export const createRating = async (
    game: string,
    userCid: string,
    rating: number,
) => {
    let user = await getAccountFromCid(userCid);
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
    const dbUser = await getAccountFromCid(user);
    if (dbUser === null) return null;
    const userId = dbUser.id;
    const rating = await prisma.rating.findFirst({
        where: {
            gameId: game,
            userId: userId
        }
    });
    if (rating === null) return null;
    return rating.rating;
}

export const getAverageRating = async (
    game: string,
) => {
    const rating = await getFromCache(`rating:${game}`);
    if (rating) return rating;

    const ratingDb = await prisma.rating.aggregate({
        where: {
            gameId: game
        },
        _avg: {
            rating: true
        }
    });

    let ratingVal = ratingDb._avg.rating;

    await setCache(`rating:${game}`, ratingVal, 5);
    return rating;
}
