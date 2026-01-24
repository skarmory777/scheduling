import crypto from 'crypto';
import { Professional } from '../../../core/domain/entities/professional.entity';
import { IProfessionalServiceRepository } from '../../../core/domain/repositories/professional.repository';
import { IUserRepository } from '../../../core/domain/repositories/user.repository';
import { IServiceRepository } from '../../../core/domain/repositories/service.repository';
import { ProfessionalServiceDTO } from '../dtos/professional-service.dto';
import { ProfessionalService } from '../../../core/domain/entities/professional-service.entity';

export class CreateProfessionalService {
    constructor(
        private professionalServiceRepository: IProfessionalServiceRepository,
        private userRepository: IUserRepository,
        private serviceRepository: IServiceRepository
    ) { }

    async execute(data: ProfessionalServiceDTO): Promise<ProfessionalService> {
        const user = await this.userRepository.findById(data.userId);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        if (!user.isProfessional()) {
            throw new Error('Usuário não é um profissional');
        }

        const existingProfessionalService =
            await this.professionalServiceRepository.findPk(data.professionalId, data.serviceId);

        if (existingProfessionalService) {
            throw new Error('Serviço já cadastrado para este profissional');
        }

        if (data.serviceId) {
            const existingServiceId = await this.serviceRepository.findById(data.serviceId);
            if (!existingServiceId) {
                throw new Error('Serviço não encontrado');
            }
        }

        const now = new Date();

        const professionalService = new ProfessionalService(
            crypto.randomUUID(),
            data.professionalId,
            data.serviceId,
            now,
            now
        );

        return this.professionalServiceRepository.create(professionalService);
    }
}
