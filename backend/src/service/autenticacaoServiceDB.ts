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
    const [clientes] = await connection.query<any[]>(
      "SELECT id FROM clientes WHERE email = ?",
      [dados.email]
    );

    if (clientes.length > 0) {
      throw new Error("Email já cadastrado");
    }

    // Hash da senha
    const senhaHash = bcrypt.hashSync(dados.password, 10);
    const agora = new Date().toISOString();

    // Inserir novo cliente
    await connection.query<ResultSetHeader>(
      `INSERT INTO clientes (nome, email, senha, telefone, ativo) 
       VALUES (?, ?, ?, ?, ?)`,
      [dados.name, dados.email, senhaHash, dados.phone, true]
    );

    return {
      id: dados.email, // Usar email como ID temporário
      name: dados.name,
      email: dados.email,
      phone: dados.phone,
      role: "client" as const,
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
    // Procurar primeiro na tabela clientes (clientes do app)
    const [clientes] = await connection.query<any[]>(
      "SELECT id, nome, email, senha, telefone, ativo FROM clientes WHERE email = ? AND ativo = true",
      [email]
    );

    console.log(`[LOGIN] Tentativa de login: ${email}`);
    console.log(`[LOGIN] Clientes encontrados: ${clientes.length}`);

    if (clientes.length === 0) {
      throw new Error("Credenciais inválidas");
    }

    const usuario = clientes[0];

    console.log(`[LOGIN] Cliente encontrado: ${usuario.nome}`);
    console.log(`[LOGIN] Hash da senha no DB: ${usuario.senha.substring(0, 20)}...`);

    const senhaValida = bcrypt.compareSync(password, usuario.senha);

    console.log(`[LOGIN] Senha válida: ${senhaValida}`);

    if (!senhaValida) {
      throw new Error("Credenciais inválidas");
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: "client" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: usuario.id.toString(),
        name: usuario.nome,
        email: usuario.email,
        phone: usuario.telefone,
        role: "client" as const,
        createdAt: new Date().toISOString(),
        isActive: true,
      },
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
    const [clientes] = await connection.query<any[]>(
      "SELECT id, nome, email, telefone, ativo FROM clientes WHERE id = ?",
      [id]
    );

    if (clientes.length === 0) {
      return undefined;
    }

    const usuario = clientes[0];

    return {
      id: usuario.id.toString(),
      name: usuario.nome,
      email: usuario.email,
      phone: usuario.telefone,
      role: "client" as const,
      createdAt: new Date().toISOString(),
      isActive: usuario.ativo,
    };
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
    const [clientes] = await connection.query<any[]>(
      "SELECT id, nome, email, telefone, ativo FROM clientes"
    );

    return clientes.map((c) => ({
      id: c.id.toString(),
      name: c.nome,
      email: c.email,
      phone: c.telefone,
      role: "client" as const,
      createdAt: new Date().toISOString(),
      isActive: c.ativo,
    }));
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
    const mapeoCampos: { [key: string]: string } = {
      name: "nome",
      phone: "telefone",
      isActive: "ativo",
    };

    const campos = Object.keys(dados)
      .filter((key) => key in mapeoCampos && key !== "id" && key !== "password")
      .map((key) => `${mapeoCampos[key]} = ?`)
      .join(", ");

    if (campos === "") {
      return buscarUsuarioPorId(id);
    }

    const valores = Object.entries(dados)
      .filter(([key]) => key in mapeoCampos && key !== "id" && key !== "password")
      .map(([, value]) => value);

    await connection.query<ResultSetHeader>(
      `UPDATE clientes SET ${campos} WHERE id = ?`,
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
      "DELETE FROM clientes WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
}
