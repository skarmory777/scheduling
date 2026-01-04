import { PrismaClient } from '@prisma/client';
import { User, Role } from '../../../core/domain/entities/user.entity';
import { IUserRepository } from '../../../core/domain/repositories/user.repository';
import { Email } from '../../../core/domain/value-objects/email.vo';
import { Password } from '../../../core/domain/value-objects/password.vo';

export class UserPrismaRepository implements IUserRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findByEmail(email: string): Promise<User | null> {
        const userData = await this.prisma.user.findUnique({
            where: { email },
            include: {
                refreshTokens: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            }
        });

        if (!userData) return null;

        const latestRefreshToken = userData.refreshTokens[0]?.tokenHash;

        return new User(
            new Email(userData.email),
            Password.create(userData.password, true),
            userData.name,
            userData.role as Role ?? Role.CLIENT,
            userData.isActive,
            userData.id,
            latestRefreshToken || undefined,
            userData.createdAt,
            userData.updatedAt
        );
    }

    async findById(id: string): Promise<User | null> {
        const userData = await this.prisma.user.findUnique({
            where: { id },
            include: {
                refreshTokens: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            }
        });

        if (!userData) return null;

        const latestRefreshToken = userData.refreshTokens[0]?.tokenHash;

        return new User(
            new Email(userData.email),
            Password.create(userData.password, true),
            userData.name,
            userData.role as Role ?? Role.CLIENT,
            userData.isActive,
            userData.id,
            latestRefreshToken || undefined,
            userData.createdAt,
            userData.updatedAt
        );
    }

    async save(user: User): Promise<User> {
        const userData = await this.prisma.user.create({
            data: {
                email: user.getEmail().getValue(),
                password: (await user.getPassword().getHashedValue()),
                name: user.getName(),
                isActive: user.getIsActive(),
                role: user.getRole(),
                // Não inclua refreshToken aqui diretamente
            }
        });

        // Se houver refresh token, crie no modelo separado
        const refreshToken = user.getRefreshToken();
        if (refreshToken) {
            const tokenExpiry = new Date();
            tokenExpiry.setDate(tokenExpiry.getDate() + 7);

            await this.prisma.refreshToken.create({
                data: {
                    tokenHash: refreshToken,
                    userId: userData.id,
                    expiresAt: tokenExpiry
                }
            });
        }

        // Busque o usuário criado com o refresh token
        const createdUser = await this.prisma.user.findUnique({
            where: { id: userData.id },
            include: {
                refreshTokens: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            }
        });

        if (!createdUser) {
            throw new Error('User not found after creation');
        }

        const latestRefreshToken = createdUser.refreshTokens[0]?.tokenHash;

        return new User(
            new Email(createdUser.email),
            Password.create(createdUser.password, true),
            createdUser.name,
            userData.role as Role ?? Role.CLIENT,
            createdUser.isActive,
            createdUser.id,
            latestRefreshToken || undefined,
            createdUser.createdAt,
            createdUser.updatedAt
        );
    }

    async update(user: User): Promise<User> {
        const userId = user.getId();
        if (!userId) {
            throw new Error('User ID is required for update');
        }

        const userData = await this.prisma.user.update({
            where: { id: userId },
            data: {
                email: user.getEmail().getValue(),
                password: (await user.getPassword().getHashedValue()),
                name: user.getName(),
                role: user.getRole(),
                isActive: user.getIsActive(),
                // Remova a linha do refreshToken daqui
                // refreshToken: user.getRefreshToken(),
                updatedAt: new Date()
            },
            // Inclua os refresh tokens relacionados se necessário
            include: {
                refreshTokens: true
            }
        });

        // Se houver refresh token, crie/atualize no modelo RefreshToken
        const refreshToken = user.getRefreshToken();
        if (refreshToken) {
            // Primeiro, delete tokens antigos para este usuário
            await this.prisma.refreshToken.deleteMany({
                where: { userId }
            });

            // Crie um novo refresh token
            const tokenExpiry = new Date();
            tokenExpiry.setDate(tokenExpiry.getDate() + 7); // 7 dias de expiração

            await this.prisma.refreshToken.create({
                data: {
                    tokenHash: refreshToken,
                    userId: userId,
                    expiresAt: tokenExpiry
                }
            });
        }

        // Busque o usuário atualizado com o refresh token
        const updatedUser = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                refreshTokens: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                }
            }
        });

        if (!updatedUser) {
            throw new Error('User not found after update');
        }

        // Use o último refresh token se existir
        const latestRefreshToken = updatedUser.refreshTokens[0]?.tokenHash;

        return new User(
            new Email(updatedUser.email),
            Password.create(updatedUser.password, true),
            updatedUser.name,
            userData.role as Role ?? Role.CLIENT,
            updatedUser.isActive,
            updatedUser.id,
            latestRefreshToken || undefined,
            updatedUser.createdAt,
            updatedUser.updatedAt
        );
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.delete({
            where: { id }
        });
    }

    async findProfessionals(): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            where: { role: 'PROFESSIONAL' }
        });

        return users.map(
            user =>
                new User(
                    new Email(user.email),
                    Password.create(user.password, true),
                    user.name,
                    Role.PROFESSIONAL,
                    user.isActive,
                    user.id,
                    undefined,
                    user.createdAt,
                    user.updatedAt
                )
        );
    }
}