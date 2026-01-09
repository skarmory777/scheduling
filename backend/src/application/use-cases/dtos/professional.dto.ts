export interface CreateProfessionalDTO {
    userId: string;
    bio?: string;
    specialization?: string;
    serviceId: string;
}
export interface UpdateProfessionalDTO {
    bio?: string;
    specialization?: string;
}
export interface ProfessionalResponseDTO {
    id: string;
    userId: string;
    bio: string | null;
    specialization: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}   