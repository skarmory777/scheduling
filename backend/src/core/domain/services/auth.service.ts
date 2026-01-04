import jwt, { Secret, SignOptions } from 'jsonwebtoken';
//import { User } from '../entities/user.entity';
import { AccessToken, RefreshToken, TokenPayload } from '../entities/token.entity';

export interface TokenConfig {
  secret: string;
  expiresIn: string;
}

export class AuthService {
  constructor(
    private readonly accessTokenConfig: TokenConfig,
    private readonly refreshTokenConfig: TokenConfig
  ) {}

  generateAccessToken(payload: TokenPayload): AccessToken {
    const token = jwt.sign(payload,
                            this.accessTokenConfig.secret as jwt.Secret,
                            {
                                expiresIn: this.accessTokenConfig.expiresIn as jwt.SignOptions['expiresIn'],
                            });

    const expiresIn = this.parseJwtExpiry(this.accessTokenConfig.expiresIn);
    
    return new AccessToken(token, expiresIn);
  }

  generateRefreshToken(payload: TokenPayload): RefreshToken {
    const token = jwt.sign(payload,
                            this.accessTokenConfig.secret as jwt.Secret,
                            {
                                expiresIn: this.accessTokenConfig.expiresIn as jwt.SignOptions['expiresIn'],
                            });

    const expiresAt = this.calculateExpiry(this.refreshTokenConfig.expiresIn);
    
    return new RefreshToken(token, expiresAt);
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, this.accessTokenConfig.secret) as TokenPayload;
  }

  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, this.refreshTokenConfig.secret) as TokenPayload;
  }

  private parseJwtExpiry(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));

    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 3600000; // 1 hour default
    }
  }

  private calculateExpiry(expiresIn: string): Date {
    const expiry = this.parseJwtExpiry(expiresIn);
    return new Date(Date.now() + expiry);
  }
}