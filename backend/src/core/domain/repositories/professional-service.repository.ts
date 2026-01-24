import { ProfessionalService } from '../entities/professional-service.entity';

export interface IProfessionalServiceRepository {
    assignService(professionalService: ProfessionalService): Promise<ProfessionalService>;
    removeService(professionalId: string, serviceId: string): Promise<void>;
    findByProfessionalId(professionalId: string): Promise<ProfessionalService[]>;
    findByServiceId(serviceId: string): Promise<ProfessionalService[]>;
    findById(id: string): Promise<ProfessionalService | null>;
    exists(professionalId: string, serviceId: string): Promise<boolean>;
}