import { Router } from "express";
import { CuponsController } from "../controller/cuponsController";

const router = Router();

// Rotas públicas
router.get("/codigo/:codigo", CuponsController.obterCuponPorCodigo);

// Rotas admin/employee
router.get("/", CuponsController.listarCupons);
router.get("/:id", CuponsController.obterCupom);
router.post("/", CuponsController.criarCupom);
router.put("/:id", CuponsController.atualizarCupom);
router.delete("/:id", CuponsController.deletarCupom);
router.post("/usar", CuponsController.usarCupom);

export default router;
