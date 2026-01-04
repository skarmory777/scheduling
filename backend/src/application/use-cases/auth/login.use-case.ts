import { IUserRepository } from '../../../core/domain/repositories/user.repository';
import { JwtStrategy } from '../../../infrastructure/auth/jwt.strategy';
import { AuthResponseDto } from '../dtos/auth.dto';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtStrategy: JwtStrategy
  ) { }

  async execute(email: string, password: string): Promise<AuthResponseDto> {
    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.getIsActive()) {
      throw new Error('User account is deactivated');
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokens = this.jwtStrategy.generateTokens(
      user.getId()!,
      user.getEmail().getValue()
    );

    // Update user with refresh token
    user.setRefreshToken(tokens.refreshToken);
    await this.userRepository.update(user);

    return new AuthResponseDto(
      tokens.accessToken,
      tokens.refreshToken,
      tokens.expiresIn,
      {
        id: user.getId()!,
        email: user.getEmail().getValue(),
        name: user.getName()
      }
    );
  }
}