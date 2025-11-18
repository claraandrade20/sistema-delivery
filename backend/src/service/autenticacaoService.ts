import { lerJSON, salvarJSON } from "../utils/fileUtils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const caminhoUsuarios = "./src/data/usuarios.json";
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

export function registrarUsuario(dados: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
}): Omit<Usuario, "password"> {
  const usuarios: Usuario[] = lerJSON(caminhoUsuarios);

  // Verificar se email já existe
  const emailExiste = usuarios.find((u) => u.email === dados.email);
  if (emailExiste) {
    throw new Error("Email já cadastrado");
  }

  // Hash da senha
  const senhaHash = bcrypt.hashSync(dados.password, 10);

  const novoUsuario: Usuario = {
    id: `client-${Date.now()}`,
    name: dados.name,
    email: dados.email,
    password: senhaHash,
    phone: dados.phone,
    role: (dados.role as any) || "client",
    createdAt: new Date().toISOString(),
    isActive: true,
  };

  usuarios.push(novoUsuario);
  salvarJSON(caminhoUsuarios, usuarios);

  const { password, ...usuarioSemSenha } = novoUsuario;
  return usuarioSemSenha;
}

export function fazerLogin(email: string, password: string): LoginResponse {
  const usuarios: Usuario[] = lerJSON(caminhoUsuarios);

  console.log(`[LOGIN] Tentativa de login: ${email}`);
  console.log(`[LOGIN] Total de usuários: ${usuarios.length}`);

  const usuario = usuarios.find((u) => u.email === email && u.isActive);

  if (!usuario) {
    console.log(`[LOGIN] Usuário não encontrado ou inativo: ${email}`);
    throw new Error("Credenciais inválidas");
  }

  console.log(`[LOGIN] Usuário encontrado: ${usuario.name}`);
  console.log(`[LOGIN] Hash da senha no DB: ${usuario.password.substring(0, 20)}...`);
  console.log(`[LOGIN] Senha fornecida: ${password}`);

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
}

export function buscarUsuarioPorId(id: string): Omit<Usuario, "password"> | undefined {
  const usuarios: Usuario[] = lerJSON(caminhoUsuarios);
  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    return undefined;
  }

  const { password, ...usuarioSemSenha } = usuario;
  return usuarioSemSenha;
}

export function listarUsuarios(): Omit<Usuario, "password">[] {
  const usuarios: Usuario[] = lerJSON(caminhoUsuarios);
  return usuarios.map(({ password, ...user }) => user);
}
