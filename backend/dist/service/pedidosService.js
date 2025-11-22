"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarPedidos = listarPedidos;
exports.buscarPedido = buscarPedido;
exports.listarPedidosPorCliente = listarPedidosPorCliente;
exports.listarPedidosPorRestaurante = listarPedidosPorRestaurante;
exports.adicionarPedido = adicionarPedido;
exports.atualizarStatusPedido = atualizarStatusPedido;
exports.atualizarPedido = atualizarPedido;
const fileUtils_1 = require("../utils/fileUtils");
const caminho = "./src/data/pedidos.json";
function listarPedidos() {
    return (0, fileUtils_1.lerJSON)(caminho);
}
function buscarPedido(id) {
    const pedidos = (0, fileUtils_1.lerJSON)(caminho);
    return pedidos.find((p) => p.id === id);
}
function listarPedidosPorCliente(customerId) {
    const pedidos = (0, fileUtils_1.lerJSON)(caminho);
    return pedidos.filter((p) => p.customerId === customerId);
}
function listarPedidosPorRestaurante(restaurantId) {
    const pedidos = (0, fileUtils_1.lerJSON)(caminho);
    return pedidos.filter((p) => p.restaurantId === restaurantId);
}
function adicionarPedido(dados) {
    const pedidos = (0, fileUtils_1.lerJSON)(caminho);
    const novoPedido = {
        id: `order-${Date.now()}`,
        ...dados,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    pedidos.push(novoPedido);
    (0, fileUtils_1.salvarJSON)(caminho, pedidos);
    return novoPedido;
}
function atualizarStatusPedido(id, status) {
    const pedidos = (0, fileUtils_1.lerJSON)(caminho);
    const index = pedidos.findIndex((p) => p.id === id);
    if (index === -1) {
        return null;
    }
    pedidos[index].status = status;
    pedidos[index].updatedAt = new Date().toISOString();
    (0, fileUtils_1.salvarJSON)(caminho, pedidos);
    return pedidos[index];
}
function atualizarPedido(id, dados) {
    const pedidos = (0, fileUtils_1.lerJSON)(caminho);
    const index = pedidos.findIndex((p) => p.id === id);
    if (index === -1) {
        return null;
    }
    pedidos[index] = {
        ...pedidos[index],
        ...dados,
        updatedAt: new Date().toISOString(),
    };
    (0, fileUtils_1.salvarJSON)(caminho, pedidos);
    return pedidos[index];
}
//# sourceMappingURL=pedidosService.js.map