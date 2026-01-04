import * as bcrypt from 'bcryptjs';

export class Password {
  private readonly value: string;
  private readonly isHashed: boolean;

  private constructor(value: string, isHashed: boolean) {
    this.value = value;
    this.isHashed = isHashed;
  }

  static create(value: string, isHashed = false): Password {
    if (!isHashed && !this.isValid(value)) {
      throw new Error('Password must be at least 8 characters long');
    }
    return new Password(value, isHashed);
  }

  private static isValid(password: string): boolean {
    return password.length >= 8;
  }

  async compare(plainPassword: string): Promise<boolean> {
    if (!this.isHashed) {
      return this.value === plainPassword;
    }
    return bcrypt.compare(plainPassword, this.value);
  }

  async getHashedValue(): Promise<string> {
    if (this.isHashed) {
      return this.value;
    }
    return bcrypt.hash(this.value, 10);
  }

  getValue(): string {
    return this.value;
  }
}