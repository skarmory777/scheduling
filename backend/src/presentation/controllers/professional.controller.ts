import { Response } from 'express';
import { PrismaProfessionalRepository } from '../../infrastructure/database/repositories/prisma-professional.repository';
import { AuthRequest } from '../../infrastructure/auth/jwt.guard';
import { UserPrismaRepository } from '../../infrastructure/database/repositories/user-prisma.repository';
import { CreateProfessional } from '../../application/use-cases/professional/create-professional.usecase';
import { ServicePrismaRepository } from '../../infrastructure/database/repositories/prisma-services.repository';

export class ProfessionalsController {
    private professionalRepository: PrismaProfessionalRepository;
    private userRepository: UserPrismaRepository;
    private serviceRepository: ServicePrismaRepository;

    constructor() {
        this.professionalRepository = new PrismaProfessionalRepository();
        this.userRepository = new UserPrismaRepository();
        this.serviceRepository = new ServicePrismaRepository();
    }

    async create(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const { bio, specialization, serviceId } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }

            const existingService = await this.serviceRepository.findById(serviceId);
            if (!existingService) {
                return res.status(400).json({ error: 'Serviço inválido' });
            }

            const createProfessional = new CreateProfessional(
                this.professionalRepository,
                this.userRepository,
                this.serviceRepository
            );

            const professional = await createProfessional.execute({
                userId,
                bio,
                specialization,
                serviceId
            });

            return res.status(201).json(professional);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getByUserId(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;

            const professional = await this.professionalRepository.findByUserId(userId);

            if (!professional) {
                return res.status(404).json({ error: 'Profissional não encontrado' });
            }

            return res.json(professional);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getById(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            const professional = await this.professionalRepository.findById(id);

            if (!professional) {
                return res.status(404).json({ error: 'Profissional não encontrado' });
            }

            return res.json(professional);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async me(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }

            const professional = await this.professionalRepository.findByUserId(userId);

            if (!professional) {
                return res.status(404).json({ error: 'Profissional não encontrado' });
            }

            return res.json(professional);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async update(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { bio, specialization, isActive } = req.body;

            const professional = await this.professionalRepository.findById(id);

            if (!professional) {
                return res.status(404).json({ error: 'Profissional não encontrado' });
            }

            professional.bio = bio ?? professional.bio;
            professional.specialization = specialization ?? professional.specialization;
            professional.isActive = isActive ?? professional.isActive;
            professional.updatedAt = new Date();

            const updatedProfessional = await this.professionalRepository.update(professional);

            return res.json(updatedProfessional);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}