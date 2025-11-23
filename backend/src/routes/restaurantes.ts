import { Router } from "express";
import {
  listarRestaurantes,
  buscarRestaurantePorId,
  criarRestaurante,
  atualizarRestaurante,
  alternarStatusRestaurante,
  deletarRestaurante,
} from "../controller/restaurantesController";

const router = Router();

// Rotas públicas
router.get("/", listarRestaurantes);
router.get("/:id", buscarRestaurantePorId);

// Rotas administrativas (podem adicionar middleware de autenticação depois)
router.post("/", criarRestaurante);
router.put("/:id", atualizarRestaurante);
router.patch("/:id/status", alternarStatusRestaurante);
router.delete("/:id", deletarRestaurante);

export default router;
