import { Router } from "express";
import * as funcionariosController from "../controller/funcionariosController";
import { autenticar, autorizarRoles } from "../middleware/middlewareAutenticacao";

const router = Router();

// Todas as rotas requerem autenticação
router.use(autenticar);
// Permitir admin ou employee (gerentes de restaurante)
router.use(autorizarRoles("admin", "employee"));

// Listar todos os funcionários
router.get("/", funcionariosController.listarFuncionarios);

// Buscar funcionário por ID
router.get("/:id", funcionariosController.buscarFuncionario);

// Criar novo funcionário
router.post("/", funcionariosController.criarFuncionario);

// Atualizar funcionário
router.put("/:id", funcionariosController.atualizarFuncionario);

// Alternar status ativo/inativo
router.patch("/:id/toggle-status", funcionariosController.alternarStatusFuncionario);

// Deletar funcionário
router.delete("/:id", funcionariosController.deletarFuncionario);

export default router;
