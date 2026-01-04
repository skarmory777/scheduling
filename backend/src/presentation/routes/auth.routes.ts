import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { JwtGuard } from '../../infrastructure/auth/jwt.guard';

export function createAuthRoutes(
  authController: AuthController,
  jwtGuard: JwtGuard
): Router {
  const router = Router();

  router.post('/register', (req, res, next) =>
    authController.register(req, res, next)
  );

  router.post('/login', (req, res, next) =>
    authController.login(req, res, next)
  );

  router.post('/refresh-token', (req, res, next) =>
    authController.refreshToken(req, res, next)
  );

  router.post('/logout', jwtGuard.protect, (req, res, next) =>
    authController.logout(req, res, next)
  );

  router.get('/me', jwtGuard.protect, (req, res, next) =>
    authController.me(req, res, next)
  );

  return router;
}