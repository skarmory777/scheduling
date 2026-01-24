import { Professional } from '../../../core/domain/entities/professional.entity';
import { IProfessionalRepository } from '../../../core/domain/repositories/professional.repository';
import { IUserRepository } from '../../../core/domain/repositories/user.repository';

export class ListProfessionalUseCase {
    constructor(private readonly professionalRepository: IProfessionalRepository) { }

    async execute(limit: number, offset: number): Promise<Professional[] | null> {
        return await this.professionalRepository.findAll(limit, offset);
    }

}