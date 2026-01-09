export interface User {
    id: string;
    name: string;
    email: string;
    role: 'CLIENT' | 'PROFESSIONAL' | 'ADMIN';
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}
