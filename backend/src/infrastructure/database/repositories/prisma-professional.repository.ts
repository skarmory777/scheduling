import { PrismaClient } from '@prisma/client';
import { IProfessionalRepository } from '../../../core/domain/repositories/professional.repository';
import { Professional } from '../../../core/domain/entities/professional.entity';
import { User } from '../../../core/domain/entities/user.entity';

export class PrismaProfessionalRepository implements IProfessionalRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }
    async save(professional: Professional): Promise<Professional> {
        const saved = await this.prisma.professional.create({
            data: {
                id: professional.id,
                userId: professional.userId,
                isActive: professional.isActive,
                createdAt: professional.createdAt,
                updatedAt: professional.updatedAt,
            },
        });

        return new Professional(
            saved.id,
            saved.userId,
            undefined,
            saved.isActive,
            saved.createdAt,
            saved.updatedAt
        );
    }

    async findById(id: string): Promise<Professional | null> {
        const found = await this.prisma.professional.findUnique({
            where: { id },
        });

        if (!found) return null;

        return new Professional(
            found.id,
            found.userId,
            undefined,
            found.isActive,
            found.createdAt,
            found.updatedAt
        );
    }

    async findByUserId(userId: string): Promise<Professional | null> {
        const found = await this.prisma.professional.findUnique({
            where: { userId },
        });

        if (!found) return null;

        return new Professional(
            found.id,
            found.userId,
            undefined,
            found.isActive,
            found.createdAt,
            found.updatedAt
        );
    }

    async update(professional: Professional): Promise<Professional> {
        const updated = await this.prisma.professional.update({
            where: { id: professional.id },
            data: {
                isActive: professional.isActive,
                updatedAt: professional.updatedAt,
            },
        });

        return new Professional(
            updated.id,
            updated.userId,
            undefined,
            updated.isActive,
            updated.createdAt,
            updated.updatedAt
        );
    }

    async delete(id: string): Promise<void> {
        await this.prisma.professional.delete({
            where: { id },
        });
    }

    async findAll(limit: number, offset: number): Promise<Professional[]> {
        const professionals = await this.prisma.professional.findMany({
            skip: offset,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return professionals.map(
            (p) =>
                new Professional(
                    p.id,
                    p.userId,
                    undefined,
                    p.isActive,
                    p.createdAt,
                    p.updatedAt
                )
        );
    }
}