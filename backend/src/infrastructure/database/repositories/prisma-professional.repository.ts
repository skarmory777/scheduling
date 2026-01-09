import { PrismaClient } from '@prisma/client';
import { IProfessionalRepository } from '../../../core/domain/repositories/professional.repository';
import { Professional } from '../../../core/domain/entities/professional.entity';

export class PrismaProfessionalRepository implements IProfessionalRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findByUserId(userId: string) {
        const data = await this.prisma.professional.findUnique({ where: { userId } });
        return data
            ? new Professional(
                data.id,
                data.userId,
                data.bio,
                data.specialization,
                data.isActive,
                data.createdAt,
                data.updatedAt
            )
            : null;
    }

    async findById(id: string): Promise<Professional | null> {
        const data = await this.prisma.professional.findUnique({ where: { id } });
        return data
            ? new Professional(
                data.id,
                data.userId,
                data.bio,
                data.specialization,
                data.isActive,
                data.createdAt,
                data.updatedAt
            )
            : null;
    }

    async create(professional: Professional) {
        const data = await this.prisma.professional.create({
            data: {
                id: professional.id,
                userId: professional.userId,
                bio: professional.bio,
                specialization: professional.specialization,
                isActive: professional.isActive,
                createdAt: professional.createdAt,
                updatedAt: professional.updatedAt,
            },
        });

        return new Professional(
            data.id,
            data.userId,
            data.bio,
            data.specialization,
            data.isActive,
            data.createdAt,
            data.updatedAt
        );
    }

    async update(professional: Professional) {
        const data = await this.prisma.professional.update({
            where: { id: professional.id },
            data: {
                bio: professional.bio,
                specialization: professional.specialization,
                isActive: professional.isActive,
                updatedAt: new Date(),
            },
        });

        return new Professional(
            data.id,
            data.userId,
            data.bio,
            data.specialization,
            data.isActive,
            data.createdAt,
            data.updatedAt
        );
    }
}
