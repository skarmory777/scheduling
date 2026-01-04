import { Service } from '../entities/service.entity';

export interface IServiceRepository {
  findById(id: string): Promise<Service | null>;
  findAll(): Promise<Service[]>;
  findActive(): Promise<Service[]>;
  create(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service>;
  update(service: Service): Promise<Service>;
}
