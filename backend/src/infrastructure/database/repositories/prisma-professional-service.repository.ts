import { PrismaClient } from '@prisma/client';
import { ProfessionalService } from '../../../core/domain/entities/professional-service.entity';
import { IProfessionalServiceRepository } from '../../../core/domain/repositories/professional-service.repository';

export class PrismaProfessionalServiceRepository implements IProfessionalServiceRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async assignService(professionalService: ProfessionalService): Promise<ProfessionalService> {
        const saved = await this.prisma.professionalService.create({
            data: {
                id: professionalService.id,
                professionalId: professionalService.professionalId,
                serviceId: professionalService.serviceId,
                createdAt: professionalService.createdAt,
                updatedAt: professionalService.updatedAt,
            },
        });

        return new ProfessionalService(
            saved.id,
            saved.professionalId,
            saved.serviceId,
            saved.createdAt,
            saved.updatedAt
        );
    }

    async removeService(professionalId: string, serviceId: string): Promise<void> {
        await this.prisma.professionalService.deleteMany({
            where: {
                professionalId,
                serviceId,
            },
        });
    }

    async findByProfessionalId(professionalId: string): Promise<ProfessionalService[]> {
        const records = await this.prisma.professionalService.findMany({
            where: { professionalId },
            include: {
                service: true,
            },
        });

        return records.map(
            (record) =>
                new ProfessionalService(
                    record.id,
                    record.professionalId,
                    record.serviceId,
                    record.createdAt,
                    record.updatedAt
                )
        );
    }

    async findByServiceId(serviceId: string): Promise<ProfessionalService[]> {
        const records = await this.prisma.professionalService.findMany({
            where: { serviceId },
        });

        return records.map(
            (record) =>
                new ProfessionalService(
                    record.id,
                    record.professionalId,
                    record.serviceId,
                    record.createdAt,
                    record.updatedAt
                )
        );
    }

    async findById(id: string): Promise<ProfessionalService | null> {
        const record = await this.prisma.professionalService.findUnique({
            where: { id },
        });

        if (!record) return null;

        return new ProfessionalService(
            record.id,
            record.professionalId,
            record.serviceId,
            record.createdAt,
            record.updatedAt
        );
    }

    async exists(professionalId: string, serviceId: string): Promise<boolean> {
        const count = await this.prisma.professionalService.count({
            where: {
                professionalId,
                serviceId,
            },
        });

        return count > 0;
    }
}