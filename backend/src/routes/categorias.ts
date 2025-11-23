import express from 'express';
import {
  listarCategorias,
  buscarCategoriaPorId,
  criarCategoria,
  atualizarCategoria,
  alternarStatusCategoria,
  deletarCategoria
} from '../controller/categoriasController';

const router = express.Router();

// GET /api/categorias - Listar todas as categorias
router.get('/', listarCategorias);

// GET /api/categorias/:id - Buscar categoria por ID
router.get('/:id', buscarCategoriaPorId);

// POST /api/categorias - Criar nova categoria
router.post('/', criarCategoria);

// PUT /api/categorias/:id - Atualizar categoria
router.put('/:id', atualizarCategoria);

// PATCH /api/categorias/:id/status - Alternar status da categoria
router.patch('/:id/status', alternarStatusCategoria);

// DELETE /api/categorias/:id - Deletar categoria
router.delete('/:id', deletarCategoria);

export default router;
