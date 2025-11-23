import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { lerJSON } from "../utils/fileUtils";
import path from "path";

const caminhoUsuarios = path.join(__dirname, "../data/usuarios.json");

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

// Funções de validação
function validarEmail(email: string): void {
  if (!email) {
    throw new Error("Email é obrigatório");
  }

  // Verificar se começa com letra minúscula
  if (email[0] !== email[0].toLowerCase()) {
    throw new Error("Email deve começar com letra minúscula");
  }

  // Verificar domínios permitidos
  const dominiosPermitidos = ["@gmail.com", "@hotmail.com", "@yahoo.com", "@restaurant.com", "@deliverysystem.com"];
  const temDominioPermitido = dominiosPermitidos.some((dominio) =>
    email.endsWith(dominio)
  );

  if (!temDominioPermitido) {
    throw new Error(
      "Email deve terminar com @gmail.com, @hotmail.com, @yahoo.com, @restaurant.com ou @deliverysystem.com"
    );
  }
}

function validarNome(nome: string): void {
  if (!nome) {
    throw new Error("Nome é obrigatório");
  }

  // Verificar se contém apenas letras e espaços
  if (!/^[a-zA-Z\s]+$/.test(nome)) {
    throw new Error("Nome deve conter apenas letras");
  }

  // Dividir nome e sobrenome
  const partes = nome.trim().split(/\s+/);

  if (partes.length < 2) {
    throw new Error("Nome deve conter nome e sobrenome");
  }

  // Verificar se cada parte começa com letra maiúscula
  for (const parte of partes) {
    if (parte[0] !== parte[0].toUpperCase()) {
      throw new Error(
        `Cada parte do nome deve começar com letra maiúscula. Erro em: ${parte}`
      );
    }
  }
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
  // Validar dados
  validarEmail(dados.email);
  validarNome(dados.name);

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
  // Normalizar email para minúsculas
  const emailNormalizado = email.toLowerCase().trim();

  console.log(`[LOGIN] Tentativa de login: ${emailNormalizado}`);

  // Primeiro, verificar se é admin ou funcionário no arquivo JSON
  try {
    const usuarios = lerJSON(caminhoUsuarios);
    const usuarioJSON = usuarios.find((u: any) => u.email === emailNormalizado && u.isActive && (u.role === 'admin' || u.role === 'employee'));

    if (usuarioJSON) {
      console.log(`[LOGIN] Usuário admin/funcionário encontrado: ${usuarioJSON.name}`);
      console.log(`[LOGIN] Hash da senha no JSON: ${usuarioJSON.password.substring(0, 20)}...`);

      const senhaValida = bcrypt.compareSync(password, usuarioJSON.password);
      console.log(`[LOGIN] Senha válida: ${senhaValida}`);

      if (!senhaValida) {
        throw new Error("Credenciais inválidas");
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: usuarioJSON.id, email: usuarioJSON.email, role: usuarioJSON.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const { password: _, ...usuarioSemSenha } = usuarioJSON;

      return {
        token,
        user: usuarioSemSenha,
      };
    }
  } catch (error) {
    console.log(`[LOGIN] Erro ao verificar arquivo JSON: ${error}`);
  }

  // Se não encontrou no JSON, procurar na tabela clientes (clientes do app)
  const connection = await pool.getConnection();

  try {
    const [clientes] = await connection.query<any[]>(
      "SELECT id, nome, email, senha, telefone, ativo FROM clientes WHERE LOWER(email) = ? AND ativo = true",
      [emailNormalizado]
    );

    console.log(`[LOGIN] Clientes encontrados no DB: ${clientes.length}`);

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

/**
 * Recupera a senha do usuário alterando para uma nova senha
 */
export async function recuperarSenha(email: string, novaSenha: string): Promise<Omit<Usuario, "password">> {
  const connection = await pool.getConnection();

  try {
    // Verificar se email existe
    const [clientes] = await connection.query<any[]>(
      "SELECT id, nome, email, telefone FROM clientes WHERE email = ?",
      [email]
    );

    if (clientes.length === 0) {
      throw new Error("Email não encontrado");
    }

    const usuario = clientes[0];

    // Validar a nova senha (6-8 caracteres, maiúscula e minúscula)
    if (novaSenha.length < 6 || novaSenha.length > 8) {
      throw new Error("Senha deve ter entre 6 e 8 caracteres");
    }

    const temMaiuscula = /[A-Z]/.test(novaSenha);
    const temMinuscula = /[a-z]/.test(novaSenha);

    if (!temMaiuscula || !temMinuscula) {
      throw new Error("Senha deve conter letras maiúsculas e minúsculas");
    }

    // Gerar novo hash
    const novoHash = bcrypt.hashSync(novaSenha, 10);

    // Atualizar senha
    await connection.query<ResultSetHeader>(
      "UPDATE clientes SET senha = ? WHERE email = ?",
      [novoHash, email]
    );

    return {
      id: usuario.id.toString(),
      name: usuario.nome,
      email: usuario.email,
      phone: usuario.telefone,
      role: "client" as const,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
  } finally {
    connection.release();
  }
}
