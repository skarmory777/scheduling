import { Professional } from '../entities/professional.entity';

export interface IProfessionalRepository {
    findByUserId(userId: string): Promise<Professional | null>;
    create(professional: Professional): Promise<Professional>;
}
