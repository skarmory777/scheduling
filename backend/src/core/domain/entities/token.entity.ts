export interface TokenPayload {
  userId: string;
  email: string;
}

export class AccessToken {
  constructor(
    public readonly token: string,
    public readonly expiresIn: number
  ) {}
}

export class RefreshToken {
  constructor(
    public readonly token: string,
    public readonly expiresAt: Date
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}