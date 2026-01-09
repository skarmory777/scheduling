import { Router } from 'express';
import { JwtGuard } from '../../infrastructure/auth/jwt.guard';
import { AppointmentController } from '../controllers/appointment.controller';

export function createAppointmentRoutes(
    jwtGuard: JwtGuard
): Router {
    const router = Router();
    const appointmentController = new AppointmentController();
    router.use(jwtGuard.protect);

    // Rotas de agendamentos (protegidas)
    router.get('/availability', (req, res) =>
        appointmentController.checkAvailability(req, res)
    );
    router.post('/', (req, res) =>
        appointmentController.create(req, res)
    );
    router.get('/', (req, res) =>
        appointmentController.listByUser(req, res)
    );
    router.patch('/:id/cancel', (req, res) =>
        appointmentController.cancel(req, res)
    );

    return router;
}