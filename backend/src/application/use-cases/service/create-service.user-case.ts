import { Service } from "../../../core/domain/entities/service.entity";
import { IServiceRepository } from "../../../core/domain/repositories/service.repository";
import { CreateServiceDTO } from "../dtos/service.dto";

export class CreateService {
    constructor(private serviceRepository: IServiceRepository) { }

    async execute(data: CreateServiceDTO): Promise<Service> {
        const now = new Date();
        const service = new Service(
            crypto.randomUUID(),
            data.name,
            data.description,
            data.duration,
            data.price,
            data.isActive ?? true,
            now,
            now
        );

        return this.serviceRepository.create(service);
    }
}