import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';

export function createServiceRoutes(
): Router {
  const router = Router();
  const serviceController = new ServiceController();

  router.get('/', (req, res) => serviceController.listActive(req, res));
  router.get('/:id', (req, res) => serviceController.getById(req, res));

  return router;
}