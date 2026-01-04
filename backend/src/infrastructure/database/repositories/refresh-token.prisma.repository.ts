import { PrismaClient } from '@prisma/client';
import { RefreshTokenRepository } from '../../../core/domain/repositories/refresh-token.repository';

export class RefreshTokenPrismaRepository implements RefreshTokenRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findByToken(tokenHash: string) {
        const refreshToken = await this.prisma.refreshToken.findUnique({
            where: { tokenHash },
            include: { user: true }
        });

        if (!refreshToken) return null;

        return {
            id: refreshToken.id,
            tokenHash: refreshToken.tokenHash,
            userId: refreshToken.userId,
            expiresAt: refreshToken.expiresAt,
            createdAt: refreshToken.createdAt
        };
    }

    async create(tokenHash: string, userId: string, expiresAt: Date): Promise<void> {
        await this.prisma.refreshToken.create({
            data: {
                tokenHash,
                userId,
                expiresAt
            }
        });
    }

    async delete(tokenHash: string): Promise<void> {
        await this.prisma.refreshToken.delete({
            where: { tokenHash }
        });
    }

    async deleteByUserId(userId: string): Promise<void> {
        await this.prisma.refreshToken.deleteMany({
            where: { userId }
        });
    }

    async deleteExpiredTokens(): Promise<void> {
        await this.prisma.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date()
                }
            }
        });
    }
}