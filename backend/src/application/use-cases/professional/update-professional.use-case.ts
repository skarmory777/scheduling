import { Professional } from '../../../core/domain/entities/professional.entity';
import { IProfessionalRepository } from '../../../core/domain/repositories/professional.repository';

export class UpdateProfessionalUseCase {
    constructor(private readonly professionalRepository: IProfessionalRepository) { }

    async execute(
        id: string,
        data: { isActive?: boolean }
    ): Promise<Professional> {
        // Buscar profissional existente
        const existingProfessional = await this.professionalRepository.findById(id);
        if (!existingProfessional) {
            throw new Error('Professional not found');
        }

        // Validar dados de atualização
        this.validateUpdateData(data);

        // Atualizar entidade
        existingProfessional.update(data);

        // Salvar no repositório
        return await this.professionalRepository.update(existingProfessional);
    }

    private validateUpdateData(data: { isActive?: boolean }): void {
        if (data.isActive !== undefined && typeof data.isActive !== 'boolean') {
            throw new Error('isActive must be a boolean');
        }
    }
}