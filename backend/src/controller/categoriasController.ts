import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
  imagem?: string;
  id_restaurantes: number;
  ativo: boolean;
  criado_em: Date;
}

// Listar todas as categorias
export const listarCategorias = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.query;
    
    let query = 'SELECT * FROM categorias';
    const params: any[] = [];
    
    if (restaurantId) {
      query += ' WHERE id_restaurantes = ?';
      params.push(parseInt(restaurantId as string));
    }
    
    query += ' ORDER BY nome ASC';
    
    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Buscar categoria por ID
export const buscarCategoriaPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM categorias WHERE id = ?',
      [parseInt(id)]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Criar nova categoria
export const criarCategoria = async (req: Request, res: Response) => {
  try {
    const { nome, descricao, imagem, id_restaurantes = 1 } = req.body;
    
    if (!nome || nome.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Nome da categoria é obrigatório'
      });
    }
    
    // Verificar se já existe uma categoria com o mesmo nome no restaurante
    const [existing] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM categorias WHERE nome = ? AND id_restaurantes = ?',
      [nome.trim(), id_restaurantes]
    );
    
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Já existe uma categoria com este nome neste restaurante'
      });
    }
    
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO categorias (nome, descricao, imagem, id_restaurantes, ativo) VALUES (?, ?, ?, ?, ?)',
      [nome.trim(), descricao || null, imagem || null, id_restaurantes, true]
    );
    
    // Buscar a categoria criada
    const [newCategory] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM categorias WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      data: newCategory[0],
      message: 'Categoria criada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Atualizar categoria
export const atualizarCategoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, descricao, imagem, ativo } = req.body;
    
    if (!nome || nome.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Nome da categoria é obrigatório'
      });
    }
    
    // Verificar se a categoria existe
    const [existing] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM categorias WHERE id = ?',
      [parseInt(id)]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada'
      });
    }
    
    // Verificar se o novo nome já existe em outro registro do mesmo restaurante
    const [nameCheck] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM categorias WHERE nome = ? AND id_restaurantes = ? AND id != ?',
      [nome.trim(), existing[0].id_restaurantes, parseInt(id)]
    );
    
    if (nameCheck.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Já existe uma categoria com este nome neste restaurante'
      });
    }
    
    await pool.execute(
      'UPDATE categorias SET nome = ?, descricao = ?, imagem = ?, ativo = ? WHERE id = ?',
      [nome.trim(), descricao || null, imagem !== undefined ? imagem : existing[0].imagem, ativo !== undefined ? ativo : existing[0].ativo, parseInt(id)]
    );
    
    // Buscar a categoria atualizada
    const [updatedCategory] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM categorias WHERE id = ?',
      [parseInt(id)]
    );
    
    res.json({
      success: true,
      data: updatedCategory[0],
      message: 'Categoria atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Alternar status da categoria (ativo/inativo)
export const alternarStatusCategoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Buscar categoria atual
    const [existing] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM categorias WHERE id = ?',
      [parseInt(id)]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada'
      });
    }
    
    const novoStatus = !existing[0].ativo;
    
    await pool.execute(
      'UPDATE categorias SET ativo = ? WHERE id = ?',
      [novoStatus, parseInt(id)]
    );
    
    // Buscar a categoria atualizada
    const [updatedCategory] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM categorias WHERE id = ?',
      [parseInt(id)]
    );
    
    res.json({
      success: true,
      data: updatedCategory[0],
      message: `Categoria ${novoStatus ? 'ativada' : 'desativada'} com sucesso`
    });
  } catch (error) {
    console.error('Erro ao alterar status da categoria:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};

// Deletar categoria
export const deletarCategoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar se a categoria existe
    const [existing] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM categorias WHERE id = ?',
      [parseInt(id)]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Categoria não encontrada'
      });
    }
    
    // Verificar se existem produtos associados à categoria
    const [produtos] = await pool.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM produtos WHERE id_categoria = ?',
      [parseInt(id)]
    );
    
    if (produtos[0].total > 0) {
      return res.status(409).json({
        success: false,
        error: 'Não é possível deletar categoria que possui produtos associados'
      });
    }
    
    await pool.execute(
      'DELETE FROM categorias WHERE id = ?',
      [parseInt(id)]
    );
    
    res.json({
      success: true,
      message: 'Categoria deletada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
};
