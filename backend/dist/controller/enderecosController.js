"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnderecos = getEnderecos;
exports.getEnderecoById = getEnderecoById;
exports.postEndereco = postEndereco;
exports.putEndereco = putEndereco;
exports.deleteEndereco = deleteEndereco;
const database_1 = __importDefault(require("../config/database"));
async function getEnderecos(req, res) {
    try {
        const { userId } = req.query;
        let query = "SELECT * FROM enderecos";
        const params = [];
        if (userId) {
            query += " WHERE id_cliente = ?";
            params.push(userId);
        }
        const [rows] = await database_1.default.query(query, params);
        res.json(rows);
    }
    catch (error) {
        console.error("Erro ao listar endereços:", error);
        res.status(500).json({ erro: error.message });
    }
}
async function getEnderecoById(req, res) {
    try {
        const { id } = req.params;
        const [rows] = await database_1.default.query("SELECT * FROM enderecos WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ erro: "Endereço não encontrado" });
        }
        res.json(rows[0]);
    }
    catch (error) {
        console.error("Erro ao buscar endereço:", error);
        res.status(500).json({ erro: error.message });
    }
}
async function postEndereco(req, res) {
    try {
        const { userId, street, number, complement, district, city, state } = req.body;
        if (!userId || !street || !number || !district) {
            return res.status(400).json({ erro: "Dados obrigatórios faltando" });
        }
        const id = crypto.randomUUID();
        const endereco = `${street}, ${number} - ${district}, ${city}/${state}`;
        const [result] = await database_1.default.query(`INSERT INTO enderecos (id, id_cliente, rua, numero, complemento, bairro, endereco)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [id, userId, street, number, complement || null, district, endereco]);
        res.status(201).json({ id, userId, street, number, complement, district, city, state });
    }
    catch (error) {
        console.error("Erro ao criar endereço:", error);
        res.status(400).json({ erro: error.message });
    }
}
async function putEndereco(req, res) {
    try {
        const { id } = req.params;
        const { street, number, complement, district, city, state } = req.body;
        const endereco = `${street}, ${number} - ${district}, ${city}/${state}`;
        await database_1.default.query(`UPDATE enderecos 
       SET rua = ?, numero = ?, complemento = ?, bairro = ?, endereco = ?
       WHERE id = ?`, [street, number, complement || null, district, endereco, id]);
        const [rows] = await database_1.default.query("SELECT * FROM enderecos WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.status(404).json({ erro: "Endereço não encontrado" });
        }
        res.json(rows[0]);
    }
    catch (error) {
        console.error("Erro ao atualizar endereço:", error);
        res.status(400).json({ erro: error.message });
    }
}
async function deleteEndereco(req, res) {
    try {
        const { id } = req.params;
        await database_1.default.query("DELETE FROM enderecos WHERE id = ?", [id]);
        res.json({ mensagem: "Endereço deletado com sucesso", id });
    }
    catch (error) {
        console.error("Erro ao deletar endereço:", error);
        res.status(500).json({ erro: error.message });
    }
}
//# sourceMappingURL=enderecosController.js.map