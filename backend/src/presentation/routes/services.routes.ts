import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';
import { JwtGuard } from '../../infrastructure/auth/jwt.guard';

export function createServiceRoutes(
  jwtGuard: JwtGuard
): Router {
  const router = Router();
  router.use(jwtGuard.protect);
  const serviceController = new ServiceController();

  router.get('/', (req, res) => serviceController.listActive(req, res));
  router.get('/:id', (req, res) => serviceController.getById(req, res));
  router.post('/', (req, res) => serviceController.create(req, res));

  return router;
}