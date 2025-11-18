import express from "express";
import {
  getPedidos,
  getPedidoById,
  criarPedido,
  atualizarStatusPedido,
  atualizarPedido,
} from "../controller/pedidosController";

const router = express.Router();

router.get("/", getPedidos);
router.get("/:id", getPedidoById);
router.post("/", criarPedido);
router.patch("/:id/status", atualizarStatusPedido);
router.put("/:id", atualizarPedido);

export default router;
