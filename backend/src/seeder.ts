import { prisma } from './prisma.js';

async function dropTables() {
    await prisma.game.deleteMany()
    await prisma.platform.deleteMany()
}

async function createPlatforms() {
    await prisma.platform.create({ data: { name: "Steam" } });
    await prisma.platform.create({ data: { name: "Board game"  } });
}

async function createGames() {
    await prisma.game.create({
        data: {
            name: "Jackbox 6",
            description: "Fun partygame to play with your friends",
            platform: {
                connect: {
                    name: "Steam"
                }
            },
            dateReleased: new Date('2021-06-23'),
            playtimeMinutes: 20,
            playerMin: 2,
            playerMax: 6
        }
    });
    
    await prisma.game.create({
        data: {
            name: "Uno",
            description: "Fun cardgame to play with your friends",
            platform: {
                connect: {
                    name: "Board game"
                }
            },
            dateReleased: new Date('1999-01-01'),
            playtimeMinutes: 15,
            playerMin: 2,
            playerMax: 8
        }
    });
}

async function seed() {
    await dropTables()
    await createPlatforms()
    await createGames()
}

await seed()