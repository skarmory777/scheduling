import { ProfessionalService } from '../../../core/domain/entities/professional-service.entity';
import { IProfessionalServiceRepository } from '../../../core/domain/repositories/professional-service.repository';
import { IProfessionalRepository } from '../../../core/domain/repositories/professional.repository';
import { IServiceRepository } from '../../../core/domain/repositories/service.repository';

export class AssignServiceUseCase {
    constructor(
        private readonly professionalServiceRepository: IProfessionalServiceRepository,
        private readonly professionalRepository: IProfessionalRepository,
        private readonly serviceRepository: IServiceRepository
    ) { }

    async execute(
        professionalId: string,
        serviceId: string
    ): Promise<ProfessionalService> {
        // Check if professional exists and is active
        const professional = await this.professionalRepository.findById(professionalId);
        if (!professional) {
            throw new Error('Professional not found');
        }
        if (!professional.isActive) {
            throw new Error('Professional is not active');
        }

        // Check if service exists and is active
        const service = await this.serviceRepository.findById(serviceId);
        if (!service) {
            throw new Error('Service not found');
        }
        if (!service.isActive) {
            throw new Error('Service is not active');
        }

        // Check if service is already assigned
        const exists = await this.professionalServiceRepository.exists(professionalId, serviceId);
        if (exists) {
            throw new Error('Service already assigned to this professional');
        }

        const professionalService = ProfessionalService.create(professionalId, serviceId);
        return await this.professionalServiceRepository.assignService(professionalService);
    }
}