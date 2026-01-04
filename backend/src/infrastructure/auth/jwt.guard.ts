import { Request, Response, NextFunction } from 'express';
import { JwtStrategy } from './jwt.strategy';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export class JwtGuard {
  constructor(private jwtStrategy: JwtStrategy) { }

  protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = this.jwtStrategy.extractTokenFromHeader(req);

    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const payload = this.jwtStrategy.verifyAccessToken(token);

    if (!payload) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    (req as any).user = payload;
    next();
  };
}
