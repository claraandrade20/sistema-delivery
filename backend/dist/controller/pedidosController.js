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
exports.getPedidos = getPedidos;
exports.getPedidoById = getPedidoById;
exports.criarPedido = criarPedido;
exports.atualizarStatusPedido = atualizarStatusPedido;
exports.atualizarPedido = atualizarPedido;
const service = __importStar(require("../service/pedidosService"));
function getPedidos(req, res) {
    try {
        const { customerId, restaurantId } = req.query;
        let pedidos;
        if (customerId) {
            pedidos = service.listarPedidosPorCliente(customerId);
        }
        else if (restaurantId) {
            pedidos = service.listarPedidosPorRestaurante(restaurantId);
        }
        else {
            pedidos = service.listarPedidos();
        }
        res.json(pedidos);
    }
    catch (error) {
        res.status(500).json({ erro: error.message });
    }
}
function getPedidoById(req, res) {
    try {
        const { id } = req.params;
        const pedido = service.buscarPedido(id);
        if (!pedido) {
            return res.status(404).json({ erro: "Pedido não encontrado" });
        }
        res.json(pedido);
    }
    catch (error) {
        res.status(500).json({ erro: error.message });
    }
}
function criarPedido(req, res) {
    try {
        const novo = service.adicionarPedido(req.body);
        res.status(201).json(novo);
    }
    catch (error) {
        res.status(400).json({ erro: error.message });
    }
}
function atualizarStatusPedido(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ erro: "Status é obrigatório" });
        }
        const atualizado = service.atualizarStatusPedido(id, status);
        if (!atualizado) {
            return res.status(404).json({ erro: "Pedido não encontrado" });
        }
        res.json(atualizado);
    }
    catch (error) {
        res.status(400).json({ erro: error.message });
    }
}
function atualizarPedido(req, res) {
    try {
        const { id } = req.params;
        const atualizado = service.atualizarPedido(id, req.body);
        if (!atualizado) {
            return res.status(404).json({ erro: "Pedido não encontrado" });
        }
        res.json(atualizado);
    }
    catch (error) {
        res.status(400).json({ erro: error.message });
    }
}
//# sourceMappingURL=pedidosController.js.map