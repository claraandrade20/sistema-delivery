import { RowDataPacket } from "mysql2/promise";
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
export interface UsuarioDB extends RowDataPacket {
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
/**
 * Registra um novo usuário no banco de dados
 */
export declare function registrarUsuario(dados: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role?: string;
}): Promise<Omit<Usuario, "password">>;
/**
 * Realiza o login do usuário
 */
export declare function fazerLogin(email: string, password: string): Promise<LoginResponse>;
/**
 * Busca um usuário por ID
 */
export declare function buscarUsuarioPorId(id: string): Promise<Omit<Usuario, "password"> | undefined>;
/**
 * Lista todos os usuários
 */
export declare function listarUsuarios(): Promise<Omit<Usuario, "password">[]>;
/**
 * Atualiza um usuário
 */
export declare function atualizarUsuario(id: string, dados: Partial<Usuario>): Promise<Omit<Usuario, "password"> | undefined>;
/**
 * Deleta um usuário
 */
export declare function deletarUsuario(id: string): Promise<boolean>;
