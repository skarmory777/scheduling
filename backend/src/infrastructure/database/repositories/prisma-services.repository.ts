import { PrismaClient } from '@prisma/client';
import { IServiceRepository } from '../../../core/domain/repositories/service.repository';
import { Service } from '../../../core/domain/entities/service.entity';

export class ServicePrismaRepository implements IServiceRepository {
  //constructor(private prisma: PrismaClient) { }
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(id: string): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({
      where: { id }
    });

    if (!service) return null;

    return new Service(
      service.id,
      service.name,
      service.description,
      service.duration,
      Number(service.price),
      service.isActive,
      service.createdAt,
      service.updatedAt
    );
  }

  async findAll(): Promise<Service[]> {
    const services = await this.prisma.service.findMany({
      orderBy: { name: 'asc' }
    });

    return services.map(
      service =>
        new Service(
          service.id,
          service.name,
          service.description,
          service.duration,
          Number(service.price),
          service.isActive,
          service.createdAt,
          service.updatedAt
        )
    );
  }

  async findActive(): Promise<Service[]> {
    const services = await this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    return services.map(
      service =>
        new Service(
          service.id,
          service.name,
          service.description,
          service.duration,
          Number(service.price),
          service.isActive,
          service.createdAt,
          service.updatedAt
        )
    );
  }

  async create(data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
    const service = await this.prisma.service.create({
      data: {
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
        isActive: data.isActive
      }
    });

    return new Service(
      service.id,
      service.name,
      service.description,
      service.duration,
      Number(service.price),
      service.isActive,
      service.createdAt,
      service.updatedAt
    );
  }

  async update(serviceData: Service): Promise<Service> {
    const service = await this.prisma.service.update({
      where: { id: serviceData.id },
      data: {
        name: serviceData.name,
        description: serviceData.description,
        duration: serviceData.duration,
        price: serviceData.price,
        isActive: serviceData.isActive
      }
    });

    return new Service(
      service.id,
      service.name,
      service.description,
      service.duration,
      Number(service.price),
      service.isActive,
      service.createdAt,
      service.updatedAt
    );
  }
}
