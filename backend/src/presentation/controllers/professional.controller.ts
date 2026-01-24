// import { Response } from 'express';
// import { plainToInstance } from 'class-transformer';
// import { ProfessionalPrismaRepository } from '../../infrastructure/database/repositories/prisma-professional.repository';
// import { AuthRequest } from '../../infrastructure/auth/jwt.guard';
// import { PrismaUserRepository } from '../../infrastructure/database/repositories/user-prisma.repository';
// import { CreateProfessional } from '../../application/use-cases/professional/create-professional.use-case';
// import { PrismaServiceRepository } from '../../infrastructure/database/repositories/prisma-services.repository';
// import { ProfessionalDTO } from '../../application/use-cases/dtos/professional.dto';
// import { ProfessionalPrismaServiceRepository } from '../../infrastructure/database/repositories/prisma-professional-service.repository';
// import { CreateProfessionalService } from '../../application/use-cases/professional/create-professional-service.usecase';
// import { ProfessionalServiceDTO } from '../../application/use-cases/dtos/professional-service.dto';
// import { Professional } from '../../core/domain/entities/professional.entity';

// export class ProfessionalsController {
//     private professionalRepository: ProfessionalPrismaRepository;
//     private userRepository: PrismaUserRepository;
//     private serviceRepository: PrismaServiceRepository;
//     private professionalServiceRepository: ProfessionalPrismaServiceRepository;

//     constructor() {
//         this.professionalRepository = new ProfessionalPrismaRepository();
//         this.userRepository = new PrismaUserRepository();
//         this.serviceRepository = new PrismaServiceRepository();
//         this.professionalServiceRepository = new ProfessionalPrismaServiceRepository();
//     }

//     private async enrichProfessional(professional: ProfessionalDTO) {
//         const services =
//             await this.professionalServiceRepository.findAllServicesByProfessionalId(
//                 professional.id
//             );

//         return { professional, services };
//     }

//     async create(req: AuthRequest, res: Response): Promise<Response> {
//         try {
//             const dto = req.body.data as ProfessionalDTO;
//             const { selectedServices } = req.body;

//             //const professionalServiceDTO = plainToInstance(ProfessionalServiceDTO, req.body);
//             ''
//             if (!dto.userId) {
//                 return res.status(401).json({ error: 'Usuário não autenticado' });
//             }

//             // const existingService = await this.serviceRepository.findById(dto.serviceId);
//             // if (!existingService) {
//             //     return res.status(400).json({ error: 'Serviço inválido' });
//             // }

//             let professional = await this.professionalRepository.findByUserId(dto.userId);

//             if (!professional) {
//                 const createProfessional = new CreateProfessional(
//                     this.professionalRepository,
//                     this.userRepository,
//                     this.serviceRepository
//                 );

//                 professional = await createProfessional.execute(dto);
//             }

//             // const existingProfessionalService = await this.professionalServiceRepository.findPk(professional.id, dto.serviceId);
//             // if (!existingProfessionalService) {
//             //     professionalServiceDTO.professionalId = professional.id;

//             //     const createProfessionalService = new CreateProfessionalService(
//             //         this.professionalServiceRepository,
//             //         this.userRepository,
//             //         this.serviceRepository
//             //     )

//             //     await createProfessionalService.execute(professionalServiceDTO);
//             // }

//             return res.json(await this.enrichProfessional(professional));
//         } catch (error: any) {
//             return res.status(400).json({ error: error.message });
//         }
//     }

//     async getByUserId(req: AuthRequest, res: Response): Promise<Response> {
//         try {
//             const { userId } = req.params;

//             const professional = await this.professionalRepository.findByUserId(userId);

//             if (!professional) {
//                 return res.status(404).json({ error: 'Profissional não encontrado' });
//             }

//             return res.json(await this.enrichProfessional(professional));
//         } catch (error: any) {
//             return res.status(400).json({ error: error.message });
//         }
//     }

//     async getById(req: AuthRequest, res: Response): Promise<Response> {
//         try {
//             const { id } = req.params;

//             const professional = await this.professionalRepository.findById(id);

//             if (!professional) {
//                 return res.status(404).json({ error: 'Profissional não encontrado' });
//             }

//             return res.json(await this.enrichProfessional(professional));
//         } catch (error: any) {
//             return res.status(400).json({ error: error.message });
//         }
//     }

//     async me(req: AuthRequest, res: Response): Promise<Response> {
//         try {
//             const userId = req.user?.userId;

//             if (!userId) {
//                 return res.status(401).json({ error: 'Usuário não autenticado' });
//             }

//             const professional = await this.professionalRepository.findByUserId(userId);

//             if (!professional) {
//                 return res.status(404).json({ error: 'Profissional não encontrado' });
//             }

//             return res.json(await this.enrichProfessional(professional));
//         } catch (error: any) {
//             return res.status(400).json({ error: error.message });
//         }
//     }

//     async update(req: AuthRequest, res: Response): Promise<Response> {
//         try {
//             // const { id } = req.params;
//             // const dto = plainToInstance(ProfessionalDTO, req.body);
//             // const professionalServiceDTO = plainToInstance(ProfessionalServiceDTO, req.body);

//             // const professional = await this.professionalRepository.findById(id);

//             // if (!professional) {
//             //     return res.status(404).json({ error: 'Profissional não encontrado' });
//             // }

//             // professional.bio = dto.bio ?? professional.bio;
//             // professional.specialization = dto.specialization ?? professional.specialization;
//             // professional.isActive = dto.isActive ?? professional.isActive;
//             // professional.updatedAt = new Date();

//             // await this.professionalRepository.update(professional);

//             // const existingProfessionalService = await this.professionalServiceRepository.findPk(professional.id, dto.serviceId);
//             // if (!existingProfessionalService) {
//             //     professionalServiceDTO.professionalId = professional.id;

//             //     const createProfessionalService = new CreateProfessionalService(
//             //         this.professionalServiceRepository,
//             //         this.userRepository,
//             //         this.serviceRepository
//             //     )

//             //     await createProfessionalService.execute(professionalServiceDTO);
//             // }

//             // return res.json(await this.enrichProfessional(professional));
//             return res.json({});
//         } catch (error: any) {
//             return res.status(400).json({ error: error.message });
//         }
//     }

//     async list(req: AuthRequest, res: Response): Promise<Response> {
//         try {
//             const listaProfessional = await this.professionalRepository.list();

//             if (!listaProfessional) {
//                 return res.status(404).json({ error: 'Profissional não encontrado' });
//             }

//             return res.json(listaProfessional);
//         } catch (error: any) {
//             return res.status(400).json({ error: error.message });
//         }
//     }
// }

import { Response } from 'express';
import { validate } from 'class-validator';
import { CreateProfessionalDto, UpdateProfessionalDto } from '../../application/use-cases/dtos/professional.dto';
import { ProfessionalService } from '../../application/services/professional.service';
import { PrismaProfessionalRepository } from '../../infrastructure/database/repositories/prisma-professional.repository';
import { AuthRequest } from '../../infrastructure/auth/jwt.guard';

export class ProfessionalController {
    private professionalRepository: PrismaProfessionalRepository;
    private professionalService: ProfessionalService;

    constructor() {
        this.professionalRepository = new PrismaProfessionalRepository();
        this.professionalService = new ProfessionalService(this.professionalRepository);
    }

    async create(req: AuthRequest, res: Response): Promise<void> {
        try {
            const dto = new CreateProfessionalDto();
            Object.assign(dto, req.body);

            const errors = await validate(dto);
            if (errors.length > 0) {
                res.status(400).json({ errors });
                return;
            }

            const professional = await this.professionalService.createProfessional(
                dto.userId,
                dto.isActive
            );

            res.status(201).json(professional);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async findById(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const professional = await this.professionalService.findProfessionalById(id);

            if (!professional) {
                res.status(404).json({ error: 'Professional not found' });
                return;
            }

            res.json(professional);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async findByUserId(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const professional = await this.professionalService.findProfessionalByUserId(userId);

            if (!professional) {
                res.status(404).json({ error: 'Professional not found' });
                return;
            }

            res.json(professional);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async update(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const dto = new UpdateProfessionalDto();
            Object.assign(dto, req.body);

            const errors = await validate(dto);
            if (errors.length > 0) {
                res.status(400).json({ errors });
                return;
            }

            const professional = await this.professionalService.updateProfessional(
                id,
                dto
            );

            res.json(professional);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async delete(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.professionalService.deleteProfessional(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async list(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const listaProfessional = await this.professionalService.findProfessionalAll();

            if (!listaProfessional) {
                return res.status(404).json({ error: 'Profissional não encontrado' });
            }

            return res.json(listaProfessional);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}