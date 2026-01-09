import { Router } from 'express';
import { JwtGuard } from '../../infrastructure/auth/jwt.guard';
import { NotificationController } from '../controllers/notification.controller';

export function createNotificationsRoutes(
    jwtGuard: JwtGuard
): Router {
    const router = Router();
    const notificationController = new NotificationController();
    router.post('/', notificationController.create);
    router.get('/professional/:professionalId', notificationController.listByProfessional);
    router.patch('/:id/read', notificationController.markAsRead);

    return router;
}
