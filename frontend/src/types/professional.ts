import { User } from "./auth";

export interface Professional {
    id: string;
    userId: string;
    isActive: boolean;
    user?: User | null;
}