import { Request, Response } from 'express';
import { ServicePrismaRepository } from '../../infrastructure/database/repositories/prisma-services.repository';
import { CreateService } from '../../application/use-cases/service/create-service.user-case';

const serviceRepository = new ServicePrismaRepository();

export class ServiceController {
  async listActive(req: Request, res: Response): Promise<Response> {
    try {
      const services = await serviceRepository.findActive();

      return res.status(200).json(
        services.map(service => ({
          id: service.id,
          name: service.name,
          description: service.description,
          duration: service.duration,
          price: service.price,
          isActive: service.isActive
        }))
      );
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const service = await serviceRepository.findById(id);

      if (!service) {
        return res.status(404).json({ error: 'Serviço não encontrado' });
      }

      return res.status(200).json({
        id: service.id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        isActive: service.isActive
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description, duration, price, isActive } = req.body;

      const createService = new CreateService(serviceRepository);
      const newService = await createService.execute({
        name,
        description,
        duration,
        price,
        isActive
      });

      const services = await serviceRepository.findActive();

      return res.status(200).json(
        services.map(service => ({
          id: service.id,
          name: service.name,
          description: service.description,
          duration: service.duration,
          price: service.price,
          isActive: service.isActive
        }))
      );
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
