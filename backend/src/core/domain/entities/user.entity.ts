import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';

export enum Role {
  CLIENT = 'CLIENT',
  PROFESSIONAL = 'PROFESSIONAL',
  ADMIN = 'ADMIN'
}

export class User {
  public id?: string;
  public email: Email;
  private password: Password;
  public name: string;
  public role?: Role;
  private isActive: boolean;
  private refreshToken?: string;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(
    email: Email,
    password: Password,
    name: string,
    role?: Role,
    isActive = true,
    id?: string,
    refreshToken?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.role = role;
    this.isActive = isActive;
    this.refreshToken = refreshToken;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Getters
  getId(): string | undefined {
    return this.id;
  }

  getEmail(): Email {
    return this.email;
  }

  getPassword(): Password {
    return this.password;
  }

  getName(): string {
    return this.name;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getRefreshToken(): string | undefined {
    return this.refreshToken;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  getRole(): Role {
    return this.role || Role.CLIENT;
  }

  // Business methods
  async validatePassword(plainPassword: string): Promise<boolean> {
    return this.password.compare(plainPassword);
  }

  async hashPassword(): Promise<void> {
    const hashedPassword = await this.password.getHashedValue();
    this.password = Password.create(hashedPassword, true);
  }

  setRefreshToken(token: string): void {
    this.refreshToken = token;
  }

  clearRefreshToken(): void {
    this.refreshToken = undefined;
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  updateName(name: string): void {
    this.name = name;
  }
  isClient(): boolean {
    return this.role === Role.CLIENT;
  }

  isProfessional(): boolean {
    return this.role === Role.PROFESSIONAL;
  }

  isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }
}