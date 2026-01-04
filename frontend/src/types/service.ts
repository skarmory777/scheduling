export interface Service {
    id: string;
    name: string;
    description: string | null;
    duration: number;
    price: number;
    isActive: boolean;
}