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
exports.getProdutos = getProdutos;
exports.getProdutoById = getProdutoById;
exports.postProduto = postProduto;
exports.putProduto = putProduto;
exports.deleteProduto = deleteProduto;
const service = __importStar(require("../service/produtos"));
function getProdutos(req, res) {
    try {
        const { restaurantId, categoryId } = req.query;
        let produtos;
        if (restaurantId) {
            produtos = service.listarProdutosPorRestaurante(restaurantId);
        }
        else if (categoryId) {
            produtos = service.listarProdutosPorCategoria(categoryId);
        }
        else {
            produtos = service.listarProdutos();
        }
        res.json(produtos);
    }
    catch (error) {
        res.status(500).json({ erro: error.message });
    }
}
function getProdutoById(req, res) {
    try {
        const { id } = req.params;
        const produto = service.buscarProdutoPorId(id);
        if (!produto) {
            return res.status(404).json({ erro: "Produto não encontrado" });
        }
        res.json(produto);
    }
    catch (error) {
        res.status(500).json({ erro: error.message });
    }
}
function postProduto(req, res) {
    try {
        const novo = service.adicionarProduto(req.body);
        res.status(201).json(novo);
    }
    catch (error) {
        res.status(400).json({ erro: error.message });
    }
}
function putProduto(req, res) {
    try {
        const { id } = req.params;
        const atualizado = service.atualizarProduto(id, req.body);
        if (!atualizado) {
            return res.status(404).json({ erro: "Produto não encontrado" });
        }
        res.json(atualizado);
    }
    catch (error) {
        res.status(400).json({ erro: error.message });
    }
}
function deleteProduto(req, res) {
    try {
        const { id } = req.params;
        const deletado = service.deletarProduto(id);
        if (!deletado) {
            return res.status(404).json({ erro: "Produto não encontrado" });
        }
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ erro: error.message });
    }
}
//# sourceMappingURL=produtosController.js.map