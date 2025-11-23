import { lerJSON, salvarJSON } from "../utils/fileUtils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";

const caminhoUsuarios = path.join(__dirname, "../data/usuarios.json");
const JWT_SECRET = process.env.JWT_SECRET || "secret-key-default-dev-only";

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

function validarSenha(password: string): void {
  if (!password) {
    throw new Error("Senha é obrigatória");
  }

  if (password.length < 6 || password.length > 8) {
    throw new Error("Senha deve ter entre 6 e 8 caracteres");
  }

  // Verificar se contém letras maiúsculas e minúsculas
  const temMaiuscula = /[A-Z]/.test(password);
  const temMinuscula = /[a-z]/.test(password);

  if (!temMaiuscula || !temMinuscula) {
    throw new Error(
      "Senha deve conter letras maiúsculas e minúsculas"
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

function validarTelefone(phone: string): void {
  if (!phone) {
    throw new Error("Telefone é obrigatório");
  }

  // Remover caracteres de formatação e verificar se contém apenas números
  const apenasNumeros = phone.replace(/\D/g, "");

  if (!/^\d+$/.test(apenasNumeros)) {
    throw new Error("Telefone deve conter apenas números");
  }

  if (apenasNumeros.length < 10) {
    throw new Error("Telefone deve conter pelo menos 10 dígitos");
  }
}

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
  // Validar dados de entrada
  validarEmail(dados.email);
  validarSenha(dados.password);
  validarNome(dados.name);
  validarTelefone(dados.phone);

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
  // Validar dados de entrada
  if (!email || !password) {
    throw new Error("Email e senha são obrigatórios");
  }

  // Normalizar email para minúsculas
  const emailNormalizado = email.toLowerCase().trim();

  const usuarios: Usuario[] = lerJSON(caminhoUsuarios);

  console.log(`[LOGIN] Tentativa de login: ${emailNormalizado}`);
  console.log(`[LOGIN] Total de usuários: ${usuarios.length}`);

  const usuario = usuarios.find((u) => u.email === emailNormalizado && u.isActive);

  if (!usuario) {
    console.log(`[LOGIN] Usuário não encontrado ou inativo: ${emailNormalizado}`);
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

export function recuperarSenha(email: string, novaSenha: string): Omit<Usuario, "password"> {
  // Validar dados
  if (!email) {
    throw new Error("Email é obrigatório");
  }

  if (!novaSenha) {
    throw new Error("Nova senha é obrigatória");
  }

  // Validar a nova senha
  validarSenha(novaSenha);

  const usuarios: Usuario[] = lerJSON(caminhoUsuarios);

  // Buscar usuário pelo email
  const usuario = usuarios.find((u) => u.email === email);

  if (!usuario) {
    throw new Error("Email não encontrado");
  }

  // Gerar novo hash de senha
  const novoHash = bcrypt.hashSync(novaSenha, 10);

  // Atualizar a senha
  usuario.password = novoHash;

  // Salvar no arquivo
  salvarJSON(caminhoUsuarios, usuarios);

  const { password, ...usuarioSemSenha } = usuario;
  return usuarioSemSenha;
}
