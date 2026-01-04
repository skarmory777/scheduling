import { Request } from 'express';
import { AuthService } from '../../core/domain/services/auth.service';
import { config } from '../config/environment';

export class JwtStrategy {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService(
      {
        secret: config.jwt.secret,
        expiresIn: config.jwt.expiresIn
      },
      {
        secret: config.jwt.refreshSecret,
        expiresIn: config.jwt.refreshExpiresIn
      }
    );
  }

  extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }

  verifyAccessToken(token: string) {
    try {
      return this.authService.verifyAccessToken(token);
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string) {
    try {
      return this.authService.verifyRefreshToken(token);
    } catch (error) {
      return null;
    }
  }

  generateTokens(userId: string, email: string) {
    const payload = { userId, email };

    const accessToken = this.authService.generateAccessToken(payload);
    const refreshToken = this.authService.generateRefreshToken(payload);

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      expiresIn: accessToken.expiresIn
    };
  }
}