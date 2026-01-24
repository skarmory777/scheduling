import { Professional } from '../../../core/domain/entities/professional.entity';
import { IProfessionalRepository } from '../../../core/domain/repositories/professional.repository';

export class CreateProfessionalUseCase {
    constructor(private readonly professionalRepository: IProfessionalRepository) { }

    async execute(
        userId: string,
        isActive: boolean = true
    ): Promise<Professional> {
        // Check if professional already exists for this user
        const existingProfessional = await this.professionalRepository.findByUserId(userId);
        if (existingProfessional) {
            throw new Error('Professional already exists for this user');
        }

        const professional = Professional.create(userId, undefined, isActive);
        return await this.professionalRepository.save(professional);
    }
}