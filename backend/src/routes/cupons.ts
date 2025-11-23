import { Router } from "express";
import { CuponsController } from "../controller/cuponsController";
import { autenticar } from "../middleware/middlewareAutenticacao";

const router = Router();

// Rotas públicas
router.get("/codigo/:codigo", CuponsController.obterCuponPorCodigo);
router.post("/usar", CuponsController.usarCupom);

// Rotas autenticadas
router.get("/", autenticar, CuponsController.listarCupons);
router.get("/:id", autenticar, CuponsController.obterCupom);
router.post("/", autenticar, CuponsController.criarCupom);
router.put("/:id", autenticar, CuponsController.atualizarCupom);
router.delete("/:id", autenticar, CuponsController.deletarCupom);

export default router;
