export interface CreateServiceDTO {
    name: string;
    description: string;
    duration: number;
    price: number;
    isActive?: boolean;
}