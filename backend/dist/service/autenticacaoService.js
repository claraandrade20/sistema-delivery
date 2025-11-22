"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarUsuario = registrarUsuario;
exports.fazerLogin = fazerLogin;
exports.buscarUsuarioPorId = buscarUsuarioPorId;
exports.listarUsuarios = listarUsuarios;
const fileUtils_1 = require("../utils/fileUtils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path"));
const caminhoUsuarios = path_1.default.join(__dirname, "../data/usuarios.json");
const JWT_SECRET = process.env.JWT_SECRET || "secret-key-default-dev-only";
function registrarUsuario(dados) {
    const usuarios = (0, fileUtils_1.lerJSON)(caminhoUsuarios);
    // Verificar se email já existe
    const emailExiste = usuarios.find((u) => u.email === dados.email);
    if (emailExiste) {
        throw new Error("Email já cadastrado");
    }
    // Hash da senha
    const senhaHash = bcryptjs_1.default.hashSync(dados.password, 10);
    const novoUsuario = {
        id: `client-${Date.now()}`,
        name: dados.name,
        email: dados.email,
        password: senhaHash,
        phone: dados.phone,
        role: dados.role || "client",
        createdAt: new Date().toISOString(),
        isActive: true,
    };
    usuarios.push(novoUsuario);
    (0, fileUtils_1.salvarJSON)(caminhoUsuarios, usuarios);
    const { password, ...usuarioSemSenha } = novoUsuario;
    return usuarioSemSenha;
}
function fazerLogin(email, password) {
    const usuarios = (0, fileUtils_1.lerJSON)(caminhoUsuarios);
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
    const senhaValida = bcryptjs_1.default.compareSync(password, usuario.password);
    console.log(`[LOGIN] Senha válida: ${senhaValida}`);
    if (!senhaValida) {
        throw new Error("Credenciais inválidas");
    }
    // Gerar token JWT
    const token = jsonwebtoken_1.default.sign({ id: usuario.id, email: usuario.email, role: usuario.role }, JWT_SECRET, { expiresIn: "7d" });
    const { password: _, ...usuarioSemSenha } = usuario;
    return {
        token,
        user: usuarioSemSenha,
    };
}
function buscarUsuarioPorId(id) {
    const usuarios = (0, fileUtils_1.lerJSON)(caminhoUsuarios);
    const usuario = usuarios.find((u) => u.id === id);
    if (!usuario) {
        return undefined;
    }
    const { password, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
}
function listarUsuarios() {
    const usuarios = (0, fileUtils_1.lerJSON)(caminhoUsuarios);
    return usuarios.map(({ password, ...user }) => user);
}
//# sourceMappingURL=autenticacaoService.js.map