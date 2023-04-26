import { Prisma } from '@prisma/client';
import { prisma } from '../prisma.js';

export const createAccount = async (
    cid: string
) => {
    try {
        await prisma.user.create({
            data: {
                cid
            }
        });
    } catch (e : any) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                return false;
            }
        }
    }
    return true;
};
