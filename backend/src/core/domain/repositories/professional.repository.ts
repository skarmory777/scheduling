import { Professional } from '../entities/professional.entity';

export interface IProfessionalRepository {
    save(professional: Professional): Promise<Professional>;
    findById(id: string): Promise<Professional | null>;
    findByUserId(userId: string): Promise<Professional | null>;
    update(professional: Professional): Promise<Professional>;
    delete(id: string): Promise<void>;
    findAll(limit: number, offset: number): Promise<Professional[] | null>;
}
