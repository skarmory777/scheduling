import { IUserRepository } from '../../../core/domain/repositories/user.repository';
import { RefreshTokenRepository } from '../../../core/domain/repositories/refresh-token.repository';
import { JwtStrategy } from '../../../infrastructure/auth/jwt.strategy';
import { AuthResponseDto } from '../dtos/auth.dto';

export class RefreshTokenUseCase {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenRepository: RefreshTokenRepository,
    private jwtStrategy: JwtStrategy
  ) { }

  async execute(refreshToken: string): Promise<AuthResponseDto> {
    // Verify refresh token
    const payload = this.jwtStrategy.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    // Find the refresh token in the database
    const storedToken = await this.refreshTokenRepository.findByToken(refreshToken);
    if (!storedToken) {
      throw new Error('Refresh token not found');
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      await this.refreshTokenRepository.delete(refreshToken);
      throw new Error('Refresh token expired');
    }

    // Find user
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if token belongs to this user
    if (storedToken.userId !== user.getId()) {
      throw new Error('Refresh token does not belong to user');
    }

    // Generate new tokens
    const tokens = this.jwtStrategy.generateTokens(
      user.getId()!,
      user.getEmail().getValue()
    );

    // Delete the old refresh token
    await this.refreshTokenRepository.delete(refreshToken);

    // Create new refresh token (7 days expiry)
    const tokenExpiry = new Date();
    tokenExpiry.setDate(tokenExpiry.getDate() + 7);

    await this.refreshTokenRepository.create(
      tokens.refreshToken,
      user.getId()!,
      tokenExpiry
    );

    // Update user entity with new refresh token
    user.setRefreshToken(tokens.refreshToken);

    return new AuthResponseDto(
      tokens.accessToken,
      tokens.refreshToken,
      tokens.expiresIn,
      {
        id: user.getId()!,
        email: user.getEmail().getValue(),
        name: user.getName(),
        role: user.getRole() ? user.getRole() as string : 'client'
      }
    );
  }
}