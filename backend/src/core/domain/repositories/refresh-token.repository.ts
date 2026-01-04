export interface RefreshTokenRepository {
    findByToken(tokenHash: string): Promise<{
        id: string;
        tokenHash: string;
        userId: string;
        expiresAt: Date;
        createdAt: Date;
    } | null>;

    create(tokenHash: string, userId: string, expiresAt: Date): Promise<void>;

    delete(tokenHash: string): Promise<void>;

    deleteByUserId(userId: string): Promise<void>;

    deleteExpiredTokens(): Promise<void>;
}