import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key-default-dev-only";

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
export async function registrarUsuario(dados: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
}): Promise<Omit<Usuario, "password">> {
  const connection = await pool.getConnection();

  try {
    // Verificar se email já existe
    const [usuarios] = await connection.query<UsuarioDB[]>(
      "SELECT id FROM usuarios WHERE email = ?",
      [dados.email]
    );

    if (usuarios.length > 0) {
      throw new Error("Email já cadastrado");
    }

    // Hash da senha
    const senhaHash = bcrypt.hashSync(dados.password, 10);
    const id = `client-${Date.now()}`;
    const agora = new Date().toISOString();
    const role = (dados.role as any) || "client";

    // Inserir novo usuário
    await connection.query<ResultSetHeader>(
      `INSERT INTO usuarios (id, name, email, password, phone, role, createdAt, isActive) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, dados.name, dados.email, senhaHash, dados.phone, role, agora, true]
    );

    return {
      id,
      name: dados.name,
      email: dados.email,
      phone: dados.phone,
      role: role as any,
      createdAt: agora,
      isActive: true,
    };
  } finally {
    connection.release();
  }
}

/**
 * Realiza o login do usuário
 */
export async function fazerLogin(email: string, password: string): Promise<LoginResponse> {
  const connection = await pool.getConnection();

  try {
    const [usuarios] = await connection.query<UsuarioDB[]>(
      "SELECT * FROM usuarios WHERE email = ? AND isActive = true",
      [email]
    );

    console.log(`[LOGIN] Tentativa de login: ${email}`);
    console.log(`[LOGIN] Usuários encontrados: ${usuarios.length}`);

    if (usuarios.length === 0) {
      throw new Error("Credenciais inválidas");
    }

    const usuario = usuarios[0];

    console.log(`[LOGIN] Usuário encontrado: ${usuario.name}`);
    console.log(`[LOGIN] Hash da senha no DB: ${usuario.password.substring(0, 20)}...`);

    const senhaValida = bcrypt.compareSync(password, usuario.password);

    console.log(`[LOGIN] Senha válida: ${senhaValida}`);

    if (!senhaValida) {
      throw new Error("Credenciais inválidas");
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...usuarioSemSenha } = usuario;

    return {
      token,
      user: usuarioSemSenha,
    };
  } finally {
    connection.release();
  }
}

/**
 * Busca um usuário por ID
 */
export async function buscarUsuarioPorId(id: string): Promise<Omit<Usuario, "password"> | undefined> {
  const connection = await pool.getConnection();

  try {
    const [usuarios] = await connection.query<UsuarioDB[]>(
      "SELECT * FROM usuarios WHERE id = ?",
      [id]
    );

    if (usuarios.length === 0) {
      return undefined;
    }

    const usuario = usuarios[0];
    const { password, ...usuarioSemSenha } = usuario;

    return usuarioSemSenha;
  } finally {
    connection.release();
  }
}

/**
 * Lista todos os usuários
 */
export async function listarUsuarios(): Promise<Omit<Usuario, "password">[]> {
  const connection = await pool.getConnection();

  try {
    const [usuarios] = await connection.query<UsuarioDB[]>("SELECT * FROM usuarios");

    return usuarios.map(({ password, ...user }) => user);
  } finally {
    connection.release();
  }
}

/**
 * Atualiza um usuário
 */
export async function atualizarUsuario(
  id: string,
  dados: Partial<Usuario>
): Promise<Omit<Usuario, "password"> | undefined> {
  const connection = await pool.getConnection();

  try {
    // Construir query dinamicamente
    const campos = Object.keys(dados)
      .filter((key) => key !== "id" && key !== "password")
      .map((key) => `${key} = ?`)
      .join(", ");

    if (campos === "") {
      return buscarUsuarioPorId(id);
    }

    const valores = Object.values(dados).filter((_, index) => {
      const keys = Object.keys(dados);
      return keys[index] !== "id" && keys[index] !== "password";
    });

    await connection.query<ResultSetHeader>(
      `UPDATE usuarios SET ${campos} WHERE id = ?`,
      [...valores, id]
    );

    return buscarUsuarioPorId(id);
  } finally {
    connection.release();
  }
}

/**
 * Deleta um usuário
 */
export async function deletarUsuario(id: string): Promise<boolean> {
  const connection = await pool.getConnection();

  try {
    const [result] = await connection.query<ResultSetHeader>(
      "DELETE FROM usuarios WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
}
