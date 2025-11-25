import type { User } from "../types/auth";
const API_BASE_URL = 'http://localhost:3001';  // backend Spring (URL base)

// Risposta login (cosa ricevo dal backend quando faccio il login)
interface LoginResponce {
    accessToken: string;
    id: string;
    name: string;
    surname: string;
    email: string;
    avatar?: string;  /// opzionale
    role: "ADMIN" | "USER" | string;
}
// Risposta register (cosa invio al backend per registrare)
interface RegisterBody {
    name: string;
    surname: string;
    email: string;
    password: string;
    avatar?: string;
}

// SOLO le chiamate API: qui non modifico lo stato Redux (prende i dati dal server)
// Login (POST /auth/login)
export async function loginApi(email: string, password: string): Promise<LoginResponce> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Login failed");
    }
    return res.json();
}

// Register
export async function registerApi(body: RegisterBody): Promise<User> {    // Restituirà una Promise che contiene un oggetto di tipo User
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Registration failed");
    }
    return res.json();
}

