//(User - dati che prendo dopo il login e salvo nel Redux Store)
export interface User{
    id: string;
    name: string;
    surname: string;
    email: string;
    avatar?: string;
    roles?: string[];
}
// stato del Redux Store per authentication
export interface AuthState{
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}