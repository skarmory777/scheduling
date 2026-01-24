import { Professional } from "../../core/domain/entities/professional.entity";
import { IProfessionalRepository } from "../../core/domain/repositories/professional.repository";
import { CreateProfessionalUseCase } from "../use-cases/professional/create-professional.use-case";
import { FindProfessionalUseCase } from "../use-cases/professional/find-professional.use-case";
import { UpdateProfessionalUseCase } from "../use-cases/professional/update-professional.use-case";

export class ProfessionalService {
    private createProfessionalUseCase: CreateProfessionalUseCase;
    private updateProfessionalUseCase: UpdateProfessionalUseCase;
    private findProfessionalUseCase: FindProfessionalUseCase;

    constructor(private readonly professionalRepository: IProfessionalRepository) {
        this.createProfessionalUseCase = new CreateProfessionalUseCase(professionalRepository);
        this.updateProfessionalUseCase = new UpdateProfessionalUseCase(professionalRepository);
        this.findProfessionalUseCase = new FindProfessionalUseCase(professionalRepository);
    }

    async createProfessional(
        userId: string,
        isActive: boolean = true
    ): Promise<Professional> {
        return await this.createProfessionalUseCase.execute(userId, isActive);
    }

    async updateProfessional(
        id: string,
        data: { isActive?: boolean }
    ): Promise<Professional> {
        return await this.updateProfessionalUseCase.execute(id, data);
    }

    async findProfessionalById(id: string): Promise<Professional | null> {
        return await this.findProfessionalUseCase.execute(id);
    }

    async findProfessionalByUserId(userId: string): Promise<Professional | null> {
        return await this.professionalRepository.findByUserId(userId);
    }

    async deleteProfessional(id: string): Promise<void> {
        return await this.professionalRepository.delete(id);
    }

    async findProfessionalAll(): Promise<Professional[] | null> {
        return await this.professionalRepository.findAll(50, 1);
    }
}