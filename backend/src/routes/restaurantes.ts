import { Router } from "express";
import {
  listarRestaurantes,
  buscarRestaurantePorId,
  criarRestaurante,
  atualizarRestaurante,
  alternarStatusRestaurante,
  deletarRestaurante,
  listarProdutosDoRestaurante,
  listarCategoriasDoRestaurante,
  obterEstatisticasRestaurante,
} from "../controller/restaurantesController";

const router = Router();

// Rotas públicas
router.get("/", listarRestaurantes);
router.get("/:id", buscarRestaurantePorId);
router.get("/:id/produtos", listarProdutosDoRestaurante);
router.get("/:id/categorias", listarCategoriasDoRestaurante);
router.get("/:id/estatisticas", obterEstatisticasRestaurante);

// Rotas administrativas (podem adicionar middleware de autenticação depois)
router.post("/", criarRestaurante);
router.put("/:id", atualizarRestaurante);
router.patch("/:id/status", alternarStatusRestaurante);
router.delete("/:id", deletarRestaurante);

export default router;
