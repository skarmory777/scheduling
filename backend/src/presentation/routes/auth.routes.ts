import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { JwtGuard } from '../../infrastructure/auth/jwt.guard';
import { UserPrismaRepository } from '../../infrastructure/database/repositories/user-prisma.repository';
import { RefreshTokenPrismaRepository } from '../../infrastructure/database/repositories/refresh-token.prisma.repository';
import { RegisterUseCase } from '../../application/use-cases/auth/register.use-case';
import { LoginUseCase } from '../../application/use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.use-case';
import { JwtStrategy } from '../../infrastructure/auth/jwt.strategy';

export function createAuthRoutes(
  jwtGuard: JwtGuard,
  jwtStrategy: JwtStrategy
): Router {
  const router = Router();

  // Dependency Injection
  const userRepository = new UserPrismaRepository();
  const refreshTokenRepository = new RefreshTokenPrismaRepository();
  // Use Cases
  const registerUseCase = new RegisterUseCase(userRepository, jwtStrategy);
  const loginUseCase = new LoginUseCase(userRepository, jwtStrategy);
  const refreshTokenUseCase = new RefreshTokenUseCase(
    userRepository,
    refreshTokenRepository,
    jwtStrategy
  );

  // Controller
  const authController = new AuthController(
    registerUseCase,
    loginUseCase,
    refreshTokenUseCase
  );

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