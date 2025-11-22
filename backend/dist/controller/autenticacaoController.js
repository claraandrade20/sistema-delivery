"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.getMe = getMe;
exports.getUsers = getUsers;
const service = __importStar(require("../service/autenticacaoService"));
function register(req, res) {
    try {
        const { name, email, password, phone, role } = req.body;
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ erro: "Dados incompletos" });
        }
        const usuario = service.registrarUsuario({ name, email, password, phone, role });
        res.status(201).json(usuario);
    }
    catch (error) {
        res.status(400).json({ erro: error.message });
    }
}
function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ erro: "Email e senha são obrigatórios" });
        }
        const resultado = service.fazerLogin(email, password);
        res.json(resultado);
    }
    catch (error) {
        res.status(401).json({ erro: error.message });
    }
}
function getMe(req, res) {
    try {
        // O middleware de autenticação já deve ter colocado o userId no req
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ erro: "Não autenticado" });
        }
        const usuario = service.buscarUsuarioPorId(userId);
        if (!usuario) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        res.json(usuario);
    }
    catch (error) {
        res.status(500).json({ erro: error.message });
    }
}
function getUsers(req, res) {
    try {
        const usuarios = service.listarUsuarios();
        res.json(usuarios);
    }
    catch (error) {
        res.status(500).json({ erro: error.message });
    }
}
//# sourceMappingURL=autenticacaoController.js.map