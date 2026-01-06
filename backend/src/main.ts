import express from 'express';
import cors from 'cors';
import { config } from './infrastructure/config/environment';
import { UserPrismaRepository } from './infrastructure/database/repositories/user.prisma.repository';
import { RefreshTokenPrismaRepository } from './infrastructure/database/repositories/refresh-token.prisma.repository';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { JwtGuard } from './infrastructure/auth/jwt.guard';
import { RegisterUseCase } from './application/use-cases/auth/register.use-case';
import { LoginUseCase } from './application/use-cases/auth/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/auth/refresh-token.use-case';
import { AuthController } from './presentation/controllers/auth.controller';
import { createAuthRoutes } from './presentation/routes/auth.routes';
import { errorMiddleware } from './application/middlewares/error.middleware';
import { createServiceRoutes } from './presentation/routes/services.routes';
import { createAppointmentRoutes } from './presentation/routes/appointments.routes';

async function bootstrap() {
  const app = express();

  // Configuração do CORS
  app.use(cors({
    origin: '*', // permite qualquer origem
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Dependency Injection
  const userRepository = new UserPrismaRepository();
  const refreshTokenRepository = new RefreshTokenPrismaRepository();
  const jwtStrategy = new JwtStrategy();
  const jwtGuard = new JwtGuard(jwtStrategy);

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

  // Routes
  app.use('/api/auth', createAuthRoutes(authController, jwtGuard));
  app.use('/api/services', createServiceRoutes());
  app.use('/api/appointments', createAppointmentRoutes(jwtGuard));

  // Health check
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Error middleware
  app.use(errorMiddleware);

  // Start server
  const PORT = config.server.port;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${config.server.nodeEnv}`);
  });
}

bootstrap().catch(console.error);
