import { Request, Response } from "express";
import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface Restaurante {
  id: number;
  nome: string;
  descricao: string;
  imagem: string;
  email: string;
  telefone: string;
  endereco: string;
  taxa_entrega: number;
  pedido_minimo: number;
  avaliacao?: number;
  ativo: boolean;
  criado_em: Date;
  atualizado_em: Date;
}

// Listar todos os restaurantes
export const listarRestaurantes = async (req: Request, res: Response) => {
  try {
    const [restaurantes] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        id,
        nome,
        descricao,
        imagem,
        email,
        telefone,
        endereco,
        taxa_entrega,
        pedido_minimo,
        avaliacao,
        ativo,
        criado_em,
        atualizado_em
      FROM restaurantes
      ORDER BY nome`
    );

    // Converter valores numéricos
    const restaurantesFormatados = restaurantes.map((r: any) => ({
      ...r,
      taxa_entrega: parseFloat(r.taxa_entrega) || 0,
      pedido_minimo: parseFloat(r.pedido_minimo) || 0,
      avaliacao: r.avaliacao ? parseFloat(r.avaliacao) : null,
    }));

    res.json(restaurantesFormatados);
  } catch (erro) {
    console.error("Erro ao listar restaurantes:", erro);
    res.status(500).json({ erro: "Erro ao buscar restaurantes" });
  }
};

// Buscar restaurante por ID
export const buscarRestaurantePorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [restaurantes] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        id,
        nome,
        descricao,
        imagem,
        email,
        telefone,
        endereco,
        taxa_entrega,
        pedido_minimo,
        avaliacao,
        ativo,
        criado_em,
        atualizado_em
      FROM restaurantes
      WHERE id = ?`,
      [id]
    );

    if (restaurantes.length === 0) {
      return res.status(404).json({ erro: "Restaurante não encontrado" });
    }

    // Converter valores numéricos
    const restaurante = restaurantes[0] as any;
    const restauranteFormatado = {
      ...restaurante,
      taxa_entrega: parseFloat(restaurante.taxa_entrega) || 0,
      pedido_minimo: parseFloat(restaurante.pedido_minimo) || 0,
      avaliacao: restaurante.avaliacao ? parseFloat(restaurante.avaliacao) : null,
    };

    res.json(restauranteFormatado);
  } catch (erro) {
    console.error("Erro ao buscar restaurante:", erro);
    res.status(500).json({ erro: "Erro ao buscar restaurante" });
  }
};

// Criar novo restaurante
export const criarRestaurante = async (req: Request, res: Response) => {
  try {
    const {
      nome,
      descricao,
      imagem,
      email,
      telefone,
      endereco,
      taxa_entrega,
      pedido_minimo,
      avaliacao,
      ativo = true,
    } = req.body;

    // Validações
    if (!nome || !email || !telefone || !endereco) {
      return res.status(400).json({
        erro: "Nome, email, telefone e endereço são obrigatórios",
      });
    }

    const [resultado] = await pool.execute<ResultSetHeader>(
      `INSERT INTO restaurantes (
        nome,
        descricao,
        imagem,
        email,
        telefone,
        endereco,
        taxa_entrega,
        pedido_minimo,
        avaliacao,
        ativo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        descricao || null,
        imagem || null,
        email,
        telefone,
        endereco,
        taxa_entrega || 0,
        pedido_minimo || 0,
        avaliacao || null,
        ativo,
      ]
    );

    const novoRestaurante = {
      id: resultado.insertId,
      nome,
      descricao,
      imagem,
      email,
      telefone,
      endereco,
      taxa_entrega,
      pedido_minimo,
      avaliacao,
      ativo,
    };

    res.status(201).json(novoRestaurante);
  } catch (erro) {
    console.error("Erro ao criar restaurante:", erro);
    res.status(500).json({ erro: "Erro ao criar restaurante" });
  }
};

// Atualizar restaurante
export const atualizarRestaurante = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      nome,
      descricao,
      imagem,
      email,
      telefone,
      endereco,
      taxa_entrega,
      pedido_minimo,
      avaliacao,
      ativo,
    } = req.body;

    // Verificar se o restaurante existe
    const [restaurantes] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM restaurantes WHERE id = ?",
      [id]
    );

    if (restaurantes.length === 0) {
      return res.status(404).json({ erro: "Restaurante não encontrado" });
    }

    await pool.execute(
      `UPDATE restaurantes SET
        nome = COALESCE(?, nome),
        descricao = COALESCE(?, descricao),
        imagem = COALESCE(?, imagem),
        email = COALESCE(?, email),
        telefone = COALESCE(?, telefone),
        endereco = COALESCE(?, endereco),
        taxa_entrega = COALESCE(?, taxa_entrega),
        pedido_minimo = COALESCE(?, pedido_minimo),
        avaliacao = COALESCE(?, avaliacao),
        ativo = COALESCE(?, ativo)
      WHERE id = ?`,
      [
        nome,
        descricao,
        imagem,
        email,
        telefone,
        endereco,
        taxa_entrega,
        pedido_minimo,
        avaliacao,
        ativo,
        id,
      ]
    );

    // Buscar restaurante atualizado
    const [restauranteAtualizado] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM restaurantes WHERE id = ?",
      [id]
    );

    // Converter valores numéricos
    const restaurante = restauranteAtualizado[0] as any;
    const restauranteFormatado = {
      ...restaurante,
      taxa_entrega: parseFloat(restaurante.taxa_entrega) || 0,
      pedido_minimo: parseFloat(restaurante.pedido_minimo) || 0,
      avaliacao: restaurante.avaliacao ? parseFloat(restaurante.avaliacao) : null,
    };

    res.json(restauranteFormatado);
  } catch (erro) {
    console.error("Erro ao atualizar restaurante:", erro);
    res.status(500).json({ erro: "Erro ao atualizar restaurante" });
  }
};

// Alternar status do restaurante (ativo/inativo)
export const alternarStatusRestaurante = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    // Buscar status atual
    const [restaurantes] = await pool.execute<RowDataPacket[]>(
      "SELECT ativo FROM restaurantes WHERE id = ?",
      [id]
    );

    if (restaurantes.length === 0) {
      return res.status(404).json({ erro: "Restaurante não encontrado" });
    }

    const novoStatus = !restaurantes[0].ativo;

    await pool.execute("UPDATE restaurantes SET ativo = ? WHERE id = ?", [
      novoStatus,
      id,
    ]);

    res.json({
      mensagem: "Status do restaurante atualizado com sucesso",
      ativo: novoStatus,
    });
  } catch (erro) {
    console.error("Erro ao alternar status do restaurante:", erro);
    res.status(500).json({ erro: "Erro ao alternar status do restaurante" });
  }
};

// Deletar restaurante
export const deletarRestaurante = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar se o restaurante existe
    const [restaurantes] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM restaurantes WHERE id = ?",
      [id]
    );

    if (restaurantes.length === 0) {
      return res.status(404).json({ erro: "Restaurante não encontrado" });
    }

    await pool.execute("DELETE FROM restaurantes WHERE id = ?", [id]);

    res.json({ mensagem: "Restaurante deletado com sucesso" });
  } catch (erro) {
    console.error("Erro ao deletar restaurante:", erro);
    res.status(500).json({ erro: "Erro ao deletar restaurante" });
  }
};

// Listar produtos de um restaurante
export const listarProdutosDoRestaurante = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { categoriaId, disponivel } = req.query;

    // Verificar se o restaurante existe
    const [restaurantes] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM restaurantes WHERE id = ?",
      [id]
    );

    if (restaurantes.length === 0) {
      return res.status(404).json({ erro: "Restaurante não encontrado" });
    }

    let query = `
      SELECT 
        p.id,
        p.nome,
        p.descricao,
        p.preco,
        p.imagem,
        p.disponivel,
        p.id_categoria,
        c.nome as categoria_nome,
        p.criado_em,
        p.atualizado_em
      FROM produtos p
      LEFT JOIN categorias c ON p.id_categoria = c.id
      WHERE p.id_restaurantes = ?
    `;

    const params: any[] = [id];

    if (categoriaId) {
      query += " AND p.id_categoria = ?";
      params.push(categoriaId);
    }

    if (disponivel !== undefined) {
      query += " AND p.disponivel = ?";
      params.push(disponivel === "true" || disponivel === "1");
    }

    query += " ORDER BY c.nome, p.nome";

    const [produtos] = await pool.execute<RowDataPacket[]>(query, params);

    // Converter valores numéricos
    const produtosFormatados = produtos.map((p: any) => ({
      ...p,
      preco: parseFloat(p.preco) || 0,
      disponivel: Boolean(p.disponivel),
    }));

    res.json(produtosFormatados);
  } catch (erro) {
    console.error("Erro ao listar produtos do restaurante:", erro);
    res.status(500).json({ erro: "Erro ao buscar produtos" });
  }
};

// Listar categorias de um restaurante
export const listarCategoriasDoRestaurante = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { ativo } = req.query;

    // Verificar se o restaurante existe
    const [restaurantes] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM restaurantes WHERE id = ?",
      [id]
    );

    if (restaurantes.length === 0) {
      return res.status(404).json({ erro: "Restaurante não encontrado" });
    }

    let query = `
      SELECT 
        c.id,
        c.nome,
        c.descricao,
        c.imagem,
        c.ativo,
        c.criado_em,
        COUNT(p.id) as total_produtos
      FROM categorias c
      LEFT JOIN produtos p ON c.id = p.id_categoria AND p.id_restaurantes = c.id_restaurantes
      WHERE c.id_restaurantes = ?
    `;

    const params: any[] = [id];

    if (ativo !== undefined) {
      query += " AND c.ativo = ?";
      params.push(ativo === "true" || ativo === "1");
    }

    query += " GROUP BY c.id, c.nome, c.descricao, c.imagem, c.ativo, c.criado_em";
    query += " ORDER BY c.nome";

    const [categorias] = await pool.execute<RowDataPacket[]>(query, params);

    // Converter valores
    const categoriasFormatadas = categorias.map((c: any) => ({
      ...c,
      ativo: Boolean(c.ativo),
      total_produtos: parseInt(c.total_produtos) || 0,
    }));

    res.json(categoriasFormatadas);
  } catch (erro) {
    console.error("Erro ao listar categorias do restaurante:", erro);
    res.status(500).json({ erro: "Erro ao buscar categorias" });
  }
};

// Obter estatísticas do restaurante
export const obterEstatisticasRestaurante = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    // Verificar se o restaurante existe
    const [restaurantes] = await pool.execute<RowDataPacket[]>(
      "SELECT id, nome FROM restaurantes WHERE id = ?",
      [id]
    );

    if (restaurantes.length === 0) {
      return res.status(404).json({ erro: "Restaurante não encontrado" });
    }

    // Total de categorias
    const [categorias] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM categorias WHERE id_restaurantes = ?",
      [id]
    );

    // Total de produtos
    const [produtos] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM produtos WHERE id_restaurantes = ?",
      [id]
    );

    // Produtos disponíveis
    const [produtosDisponiveis] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM produtos WHERE id_restaurantes = ? AND disponivel = true",
      [id]
    );

    // Total de pedidos
    const [pedidos] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM pedidos WHERE id_restaurantes = ?",
      [id]
    );

    // Receita total
    const [receita] = await pool.execute<RowDataPacket[]>(
      `SELECT COALESCE(SUM(valor_total), 0) as total 
       FROM pedidos 
       WHERE id_restaurantes = ? AND status IN ('concluido', 'entregue')`,
      [id]
    );

    const estatisticas = {
      restaurante: {
        id: restaurantes[0].id,
        nome: restaurantes[0].nome,
      },
      total_categorias: parseInt(categorias[0].total) || 0,
      total_produtos: parseInt(produtos[0].total) || 0,
      produtos_disponiveis: parseInt(produtosDisponiveis[0].total) || 0,
      total_pedidos: parseInt(pedidos[0].total) || 0,
      receita_total: parseFloat(receita[0].total) || 0,
    };

    res.json(estatisticas);
  } catch (erro) {
    console.error("Erro ao obter estatísticas do restaurante:", erro);
    res.status(500).json({ erro: "Erro ao buscar estatísticas" });
  }
};
