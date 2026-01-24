import { IsEmail, IsString, IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UserDTO {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  role!: string;

  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;

  // Constructor tradicional
  constructor(
    id: string,
    email: string,
    name: string,
    role: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

// Interfaces auxiliares para criação e atualização
export interface CreateUserDTO {
  email: string;
  name: string;
  role: string;
  password: string;
}

export interface UpdateUserDTO {
  email?: string;
  name?: string;
  role?: string;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
}