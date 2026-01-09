import { Response } from 'express';
import { PrismaNotificationRepository } from '../../infrastructure/database/repositories/prisma-notification.repository';
import { AuthRequest } from '../../infrastructure/auth/jwt.guard';
import { UserPrismaRepository } from '../../infrastructure/database/repositories/user-prisma.repository';
import { CreateNotificationUseCase } from '../../application/use-cases/notification/create-notification.usecase';

export class NotificationController {
    private notificationRepository: PrismaNotificationRepository;
    private userRepository: UserPrismaRepository;

    constructor() {
        this.notificationRepository = new PrismaNotificationRepository();
        this.userRepository = new UserPrismaRepository();
    }

    async create(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const { professionalId, appointmentId, type, title, message } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }

            const useCase = new CreateNotificationUseCase(
                this.notificationRepository,
                this.userRepository
            );

            const notification = await useCase.execute({
                professionalId,
                appointmentId,
                type,
                title,
                message,
            });

            return res.status(201).json(notification);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async listByProfessional(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const { professionalId } = req.params;
            const notifications = await this.notificationRepository.findByProfessionalId(professionalId);
            return res.json(notifications);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async markAsRead(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const notification = await this.notificationRepository.markAsRead(id);
            return res.json(notification);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}   
