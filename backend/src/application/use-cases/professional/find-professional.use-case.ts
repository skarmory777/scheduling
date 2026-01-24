import { Professional } from '../../../core/domain/entities/professional.entity';
import { IProfessionalRepository } from '../../../core/domain/repositories/professional.repository';

export class FindProfessionalUseCase {
    constructor(private readonly professionalRepository: IProfessionalRepository) { }

    async execute(id: string): Promise<Professional | null> {
        if (!id || typeof id !== 'string') {
            throw new Error('Invalid professional ID');
        }

        return await this.professionalRepository.findById(id);
    }

    async executeWithServices(id: string): Promise<{
        professional: Professional;
        servicesCount: number;
    } | null> {
        const professional = await this.execute(id);

        if (!professional) {
            return null;
        }

        // Aqui você pode adicionar lógica para buscar serviços associados
        // ou outras informações relacionadas
        // Por enquanto, retornamos apenas o professional e um placeholder para serviços

        return {
            professional,
            servicesCount: 0, // Este valor seria calculado com mais informações
        };
    }

    async executeWithFilters(filters: {
        isActive?: boolean;
        userId?: string;
    }): Promise<Professional[]> {
        // Este método pode ser expandido conforme necessário
        // Por enquanto, implementamos uma versão simples

        if (filters.userId) {
            const professional = await this.professionalRepository.findByUserId(filters.userId);
            return professional ? [professional] : [];
        }

        // Para filtros mais complexos, você pode criar um método no repositório
        throw new Error('Filter method not implemented yet');
    }
}