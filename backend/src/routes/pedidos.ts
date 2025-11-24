import express from "express";
import {
  getPedidos,
  getPedidoById,
  criarPedido,
  atualizarStatusPedido,
  atualizarPedido,
  getItensVendas,
} from "../controller/pedidosController";

const router = express.Router();

// Rotas estáticas DEVEM vir antes das rotas com parâmetros dinâmicos
router.get("/", getPedidos);
router.get("/itens/vendas", getItensVendas);
router.post("/", criarPedido);

// Rotas com parâmetros dinâmicos vêm por último
router.get("/:id", getPedidoById);
router.patch("/:id/status", atualizarStatusPedido);
router.put("/:id", atualizarPedido);

export default router;
