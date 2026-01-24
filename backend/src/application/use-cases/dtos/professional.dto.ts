import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateProfessionalDto {
    @IsString()
    userId!: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateProfessionalDto {
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}