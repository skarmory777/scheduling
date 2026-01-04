import express from 'express';
import { config } from './infrastructure/config/environment';
import { UserPrismaRepository } from './infrastructure/database/repositories/user.prisma.repository';
import { RefreshTokenPrismaRepository } from './infrastructure/database/repositories/refresh-token.prisma.repository'; // Nova importação
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

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Dependency Injection
  const userRepository = new UserPrismaRepository();
  const refreshTokenRepository = new RefreshTokenPrismaRepository(); // Nova instância
  const jwtStrategy = new JwtStrategy();
  const jwtGuard = new JwtGuard(jwtStrategy);

  // Use Cases
  const registerUseCase = new RegisterUseCase(userRepository, jwtStrategy);
  const loginUseCase = new LoginUseCase(userRepository, jwtStrategy);
  const refreshTokenUseCase = new RefreshTokenUseCase(
    userRepository,
    refreshTokenRepository, // Passando o novo repositório
    jwtStrategy
  );

  // Controller
  const authController = new AuthController(
    registerUseCase,
    loginUseCase,
    refreshTokenUseCase
  );

  // Routes
  const authRoutes = createAuthRoutes(authController, jwtGuard);
  const serviceRoutes = createServiceRoutes();
  const appointmentRoutes = createAppointmentRoutes(jwtGuard);

  app.use('/api/auth', authRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/appointments', appointmentRoutes);

  // Health check
  app.get('/health', (req, res) => {
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