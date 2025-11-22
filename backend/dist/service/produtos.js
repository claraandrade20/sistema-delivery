"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarProdutos = listarProdutos;
exports.buscarProdutoPorId = buscarProdutoPorId;
exports.listarProdutosPorRestaurante = listarProdutosPorRestaurante;
exports.listarProdutosPorCategoria = listarProdutosPorCategoria;
exports.adicionarProduto = adicionarProduto;
exports.atualizarProduto = atualizarProduto;
exports.deletarProduto = deletarProduto;
const fileUtils_1 = require("../utils/fileUtils");
const caminho = "./src/data/produtos.json";
function listarProdutos() {
    return (0, fileUtils_1.lerJSON)(caminho);
}
function buscarProdutoPorId(id) {
    const produtos = (0, fileUtils_1.lerJSON)(caminho);
    return produtos.find((p) => p.id === id);
}
function listarProdutosPorRestaurante(restaurantId) {
    const produtos = (0, fileUtils_1.lerJSON)(caminho);
    return produtos.filter((p) => p.restaurantId === restaurantId && p.isActive);
}
function listarProdutosPorCategoria(categoryId) {
    const produtos = (0, fileUtils_1.lerJSON)(caminho);
    return produtos.filter((p) => p.categoryId === categoryId && p.isActive);
}
function adicionarProduto(produto) {
    const produtos = (0, fileUtils_1.lerJSON)(caminho);
    const novo = {
        id: `prod-${Date.now()}`,
        ...produto,
    };
    produtos.push(novo);
    (0, fileUtils_1.salvarJSON)(caminho, produtos);
    return novo;
}
function atualizarProduto(id, dados) {
    const produtos = (0, fileUtils_1.lerJSON)(caminho);
    const index = produtos.findIndex((p) => p.id === id);
    if (index === -1) {
        return null;
    }
    produtos[index] = { ...produtos[index], ...dados };
    (0, fileUtils_1.salvarJSON)(caminho, produtos);
    return produtos[index];
}
function deletarProduto(id) {
    const produtos = (0, fileUtils_1.lerJSON)(caminho);
    const index = produtos.findIndex((p) => p.id === id);
    if (index === -1) {
        return false;
    }
    produtos.splice(index, 1);
    (0, fileUtils_1.salvarJSON)(caminho, produtos);
    return true;
}
//# sourceMappingURL=produtos.js.map