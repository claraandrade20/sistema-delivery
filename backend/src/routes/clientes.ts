import { Router } from "express";
import * as clientesController from "../controller/clientesController";
import { autenticar, autorizarRoles } from "../middleware/middlewareAutenticacao";

const router = Router();

// Todas as rotas requerem autenticação
router.use(autenticar);

// Listar todos os clientes
router.get("/", clientesController.listarClientes);

// Buscar cliente por ID
router.get("/:id", clientesController.buscarCliente);

// Atualizar cliente
router.put("/:id", clientesController.atualizarCliente);

// Alternar status ativo/inativo
router.patch("/:id/toggle-status", clientesController.alternarStatusCliente);

// Deletar cliente (apenas admin)
router.delete("/:id", autorizarRoles("admin"), clientesController.deletarCliente);

export default router;
