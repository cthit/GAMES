import { prisma } from '../prisma.js';
import { getFromCache, setCache } from './cacheService.js';
import { getAccountFromCid } from '../services/accountService.js';

export const createRating = async (
	game: string,
	userCid: string,
	rating: number,
	motivation?: string
) => {
	let user = await getAccountFromCid(userCid);
	if (!user) {
		return null;
	}
	let userId = user.id;
	const ratingData = {
		rating: rating,
		motivation: motivation ? motivation : undefined
	}
	await prisma.rating.upsert({
		where: {
			userId_gameId: {
				gameId: game,
				userId: userId
			}
		},
		update: ratingData,
		create: {
			...ratingData,
			gameId: game,
			userId: userId
		}
	});
	_getAverageRatingNoCache(game);
};

export const getUserRating = async (game: string, user: string) => {
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
};

export const getUserMotivation = async (game: string, user: string) => {
	const dbUser = await getAccountFromCid(user);
	if (dbUser === null) return undefined;
	const userId = dbUser.id;
	const rating = await prisma.rating.findFirst({
		where: {
			gameId: game,
			userId: userId
		}
	});
	if (!rating?.motivation) return undefined;
	return rating.motivation;
};

export const getAverageRating = async (game: string) => {
	const rating = await getFromCache<number>(`rating:${game}`);
	if (rating) return rating;

	return await _getAverageRatingNoCache(game);
};


const _getAverageRatingNoCache = async (game: string) => {
	const ratingDb = await prisma.rating.aggregate({
		where: {
			gameId: game
		},
		_avg: {
			rating: true
		}
	});

	let rating = ratingDb._avg.rating;

	const DAY = 24 * 60 * 60;
	await setCache(`rating:${game}`, rating, DAY);
	return rating;
};

export const getGameRatings = async (game: string) => {
	const ratings = await prisma.rating.findMany({
		where: {
			gameId: game
		},
		select: {
			rating: true,
			motivation: true
		}
	});
	console.debug(ratings);
	return ratings;
}