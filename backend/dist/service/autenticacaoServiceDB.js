"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrarUsuario = registrarUsuario;
exports.fazerLogin = fazerLogin;
exports.buscarUsuarioPorId = buscarUsuarioPorId;
exports.listarUsuarios = listarUsuarios;
exports.atualizarUsuario = atualizarUsuario;
exports.deletarUsuario = deletarUsuario;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const JWT_SECRET = process.env.JWT_SECRET || "secret-key-default-dev-only";
/**
 * Registra um novo usuário no banco de dados
 */
async function registrarUsuario(dados) {
    const connection = await database_1.default.getConnection();
    try {
        // Verificar se email já existe
        const [usuarios] = await connection.query("SELECT id FROM usuarios WHERE email = ?", [dados.email]);
        if (usuarios.length > 0) {
            throw new Error("Email já cadastrado");
        }
        // Hash da senha
        const senhaHash = bcryptjs_1.default.hashSync(dados.password, 10);
        const id = `client-${Date.now()}`;
        const agora = new Date().toISOString();
        const role = dados.role || "client";
        // Inserir novo usuário
        await connection.query(`INSERT INTO usuarios (id, name, email, password, phone, role, createdAt, isActive) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [id, dados.name, dados.email, senhaHash, dados.phone, role, agora, true]);
        return {
            id,
            name: dados.name,
            email: dados.email,
            phone: dados.phone,
            role: role,
            createdAt: agora,
            isActive: true,
        };
    }
    finally {
        connection.release();
    }
}
/**
 * Realiza o login do usuário
 */
async function fazerLogin(email, password) {
    const connection = await database_1.default.getConnection();
    try {
        const [usuarios] = await connection.query("SELECT * FROM usuarios WHERE email = ? AND isActive = true", [email]);
        console.log(`[LOGIN] Tentativa de login: ${email}`);
        console.log(`[LOGIN] Usuários encontrados: ${usuarios.length}`);
        if (usuarios.length === 0) {
            throw new Error("Credenciais inválidas");
        }
        const usuario = usuarios[0];
        console.log(`[LOGIN] Usuário encontrado: ${usuario.name}`);
        console.log(`[LOGIN] Hash da senha no DB: ${usuario.password.substring(0, 20)}...`);
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
    finally {
        connection.release();
    }
}
/**
 * Busca um usuário por ID
 */
async function buscarUsuarioPorId(id) {
    const connection = await database_1.default.getConnection();
    try {
        const [usuarios] = await connection.query("SELECT * FROM usuarios WHERE id = ?", [id]);
        if (usuarios.length === 0) {
            return undefined;
        }
        const usuario = usuarios[0];
        const { password, ...usuarioSemSenha } = usuario;
        return usuarioSemSenha;
    }
    finally {
        connection.release();
    }
}
/**
 * Lista todos os usuários
 */
async function listarUsuarios() {
    const connection = await database_1.default.getConnection();
    try {
        const [usuarios] = await connection.query("SELECT * FROM usuarios");
        return usuarios.map(({ password, ...user }) => user);
    }
    finally {
        connection.release();
    }
}
/**
 * Atualiza um usuário
 */
async function atualizarUsuario(id, dados) {
    const connection = await database_1.default.getConnection();
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
        await connection.query(`UPDATE usuarios SET ${campos} WHERE id = ?`, [...valores, id]);
        return buscarUsuarioPorId(id);
    }
    finally {
        connection.release();
    }
}
/**
 * Deleta um usuário
 */
async function deletarUsuario(id) {
    const connection = await database_1.default.getConnection();
    try {
        const [result] = await connection.query("DELETE FROM usuarios WHERE id = ?", [id]);
        return result.affectedRows > 0;
    }
    finally {
        connection.release();
    }
}
//# sourceMappingURL=autenticacaoServiceDB.js.map