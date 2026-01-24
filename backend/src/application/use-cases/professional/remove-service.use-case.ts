import { IProfessionalServiceRepository } from '../../../core/domain/repositories/professional-service.repository';

export class RemoveServiceUseCase {
    constructor(private readonly professionalServiceRepository: IProfessionalServiceRepository) { }

    async execute(
        professionalId: string,
        serviceId: string
    ): Promise<void> {
        // Validar IDs
        if (!professionalId || !serviceId) {
            throw new Error('Professional ID and Service ID are required');
        }

        // Verificar se a associação existe
        const exists = await this.professionalServiceRepository.exists(professionalId, serviceId);
        if (!exists) {
            throw new Error('Service not assigned to this professional');
        }

        // Remover a associação
        await this.professionalServiceRepository.removeService(professionalId, serviceId);
    }
}