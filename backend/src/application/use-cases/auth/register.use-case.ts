import { User } from '../../../core/domain/entities/user.entity';
import { Email } from '../../../core/domain/value-objects/email.vo';
import { Password } from '../../../core/domain/value-objects/password.vo';
import { IUserRepository } from '../../../core/domain/repositories/user.repository';
import { JwtStrategy } from '../../../infrastructure/auth/jwt.strategy';
import { AuthResponseDto } from '../dtos/auth.dto';
import { Role } from '../../../core/domain/entities/user.entity';

export class RegisterUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtStrategy: JwtStrategy
  ) { }

  async execute(email: string, password: string, name: string, role?: string): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create user entity
    const user = new User(
      new Email(email),
      Password.create(password),
      name,
      role as Role
    );

    // Hash password
    await user.hashPassword();

    // Save user
    const savedUser = await this.userRepository.save(user);

    // Generate tokens
    const tokens = this.jwtStrategy.generateTokens(
      savedUser.getId()!,
      savedUser.getEmail().getValue()
    );

    // Update user with refresh token
    savedUser.setRefreshToken(tokens.refreshToken);
    await this.userRepository.update(savedUser);

    return new AuthResponseDto(
      tokens.accessToken,
      tokens.refreshToken,
      tokens.expiresIn,
      {
        id: savedUser.getId()!,
        email: savedUser.getEmail().getValue(),
        name: savedUser.getName(),
        role: savedUser.getRole() ? savedUser.getRole() as string : 'client'
      }
    );
  }
}