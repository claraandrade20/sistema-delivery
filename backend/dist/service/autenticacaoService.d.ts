export interface Usuario {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    role: "client" | "employee" | "admin";
    createdAt: string;
    isActive: boolean;
    restaurantId?: string;
}
export interface LoginResponse {
    token: string;
    user: Omit<Usuario, "password">;
}
export declare function registrarUsuario(dados: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: string;
}): Omit<Usuario, "password">;
export declare function fazerLogin(email: string, password: string): LoginResponse;
export declare function buscarUsuarioPorId(id: string): Omit<Usuario, "password"> | undefined;
export declare function listarUsuarios(): Omit<Usuario, "password">[];
