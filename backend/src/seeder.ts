import { prisma } from './prisma.js';

async function dropTables() {
	await prisma.game.deleteMany();
	await prisma.platform.deleteMany();
	await prisma.gameOwner.deleteMany();
	await prisma.user.deleteMany();
}

async function createPlatforms() {
	await prisma.platform.create({ data: { name: 'Steam' } });
	await prisma.platform.create({ data: { name: 'Board game' } });
}

async function createAccounts() {
	const user = await prisma.user.create({
		data: {
			cid: 'admin'
		}
	});

	const owner = await prisma.gameOwner.create({
		data: {
			ownerId: user.id,
			ownerType: 'USER'
		}
	});

	const user2 = await prisma.user.create({
		data: {
			cid: 'flongshaw'
		}
	});

	const owner2 = await prisma.gameOwner.create({
		data: {
			ownerId: user2.id,
			ownerType: 'USER'
		}
	});

	return [owner.id, owner2.id];
}

async function createGames(gameOwnerIds: string[]) {
	await prisma.game.create({
		data: {
			name: 'Jackbox 6',
			description: 'Fun partygame to play with your friends',
			platform: {
				connect: {
					name: 'Steam'
				}
			},
			GameOwner: {
				connect: {
					id: gameOwnerIds[0]
				}
			},
			dateReleased: new Date('2021-06-23'),
			playtimeMinutes: 20,
			playerMin: 2,
			playerMax: 6,
			location: 'LaggIT steam account'
		}
	});

	await prisma.game.create({
		data: {
			name: 'Uno',
			description: 'Fun cardgame to play with your friends',
			platform: {
				connect: {
					name: 'Board game'
				}
			},
			GameOwner: {
				connect: {
					id: gameOwnerIds[1]
				}
			},
			dateReleased: new Date('1999-01-01'),
			playtimeMinutes: 15,
			playerMin: 2,
			playerMax: 8,
			location: 'DrawIT game cabinet'
		}
	});
}

async function seed() {
	await dropTables();
	await createPlatforms();
	const gameOwnerIds = await createAccounts();
	await createGames(gameOwnerIds);
}

await seed();
