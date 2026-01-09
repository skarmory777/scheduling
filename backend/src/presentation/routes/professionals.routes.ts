import { Router } from 'express';
import { JwtGuard } from '../../infrastructure/auth/jwt.guard';
import { ProfessionalsController } from '../controllers/professional.controller';

export function createProfessionalsRoutes(
    jwtGuard: JwtGuard
): Router {
    const router = Router();
    const professionalsController = new ProfessionalsController();
    router.post('/', professionalsController.create);
    router.get('/me', professionalsController.me);
    router.put('/:id', professionalsController.update);

    return router;
}
