import crypto from 'crypto';
import { Professional } from '../../../core/domain/entities/professional.entity';
import { IProfessionalRepository } from '../../../core/domain/repositories/professional.repository';
import { IUserRepository } from '../../../core/domain/repositories/user.repository';
import { IServiceRepository } from '../../../core/domain/repositories/service.repository';
import { CreateProfessionalDTO } from '../dtos/professional.dto';

export class CreateProfessional {
    constructor(
        private professionalRepository: IProfessionalRepository,
        private userRepository: IUserRepository,
        private serviceRepository: IServiceRepository
    ) { }

    async execute(data: CreateProfessionalDTO): Promise<Professional> {
        // 1. Validar usuário
        const user = await this.userRepository.findById(data.userId);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        if (!user.isProfessional()) {
            throw new Error('Usuário não é um profissional');
        }

        // 2. Verificar se já existe profissional para este usuário
        const existingProfessional =
            await this.professionalRepository.findByUserId(data.userId);

        if (existingProfessional) {
            throw new Error('Profissional já cadastrado para este usuário');
        }

        if (data.serviceId) {
            const existingServiceId = await this.serviceRepository.findById(data.serviceId);
            if (!existingServiceId) {
                throw new Error('Serviço não encontrado');
            }
        }

        // 3. Criar profissional
        const now = new Date();

        const professional = new Professional(
            crypto.randomUUID(),
            data.userId,
            data.bio ?? null,
            data.specialization ?? null,
            true,
            now,
            now
        );

        // 4. Persistir
        return this.professionalRepository.create(professional);
    }
}
