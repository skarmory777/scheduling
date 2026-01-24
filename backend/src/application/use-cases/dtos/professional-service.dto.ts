import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class ProfessionalServiceDTO {
    @IsString()
    @IsNotEmpty()
    userId!: string;

    @IsString()
    @IsNotEmpty()
    professionalId!: string;

    @IsString()
    @IsNotEmpty()
    serviceId!: string;
} 