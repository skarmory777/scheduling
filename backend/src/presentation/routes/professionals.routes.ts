import { Router } from 'express';
import { JwtGuard } from '../../infrastructure/auth/jwt.guard';
import { ProfessionalController } from '../controllers/professional.controller';

export function createProfessionalsRoutes(
    jwtGuard: JwtGuard
): Router {
    const router = Router();
    const professionalController = new ProfessionalController();

    router.post('/professionals', (req, res) => professionalController.create(req, res));
    router.get('/professionals/:id', (req, res) => professionalController.findById(req, res));
    router.get('/professionals/user/:userId', (req, res) => professionalController.findByUserId(req, res));
    router.put('/professionals/:id', (req, res) => professionalController.update(req, res));
    router.delete('/professionals/:id', (req, res) => professionalController.delete(req, res));

    // router.post('/professionals/:professionalId/services', (req, res) => 
    //   professionalServiceController.assignService(req, res)
    // );
    // router.delete('/professionals/:professionalId/services/:serviceId', (req, res) => 
    //   professionalServiceController.removeService(req, res)
    // );
    // router.get('/professionals/:professionalId/services', (req, res) => 
    //   professionalServiceController.getProfessionalServices(req, res)
    // );    

    return router;
}
