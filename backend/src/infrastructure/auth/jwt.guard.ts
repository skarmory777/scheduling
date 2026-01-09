import { Request, Response, NextFunction } from 'express';
import { JwtStrategy } from './jwt.strategy';
import { UserPrismaRepository } from '../database/repositories/user-prisma.repository';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export class JwtGuard {
  constructor(private jwtStrategy: JwtStrategy) { }

  protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
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

    const userRepository = new UserPrismaRepository();

    const user = await userRepository.findById(payload.userId);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = {
      userId: user.getId()!,
      email: user.getEmail().getValue(),
      role: user.getRole() ? user.getRole() as string : 'client'
    };

    next();
  };
}
