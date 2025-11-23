import pool from "../config/database";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  imagem?: string;
  id_categoria: number;
  id_restaurantes: number;
  quantidade_estoque: number;
  ativo: boolean;
  destaque?: boolean;
  avaliacao?: number;
  total_avaliacoes?: number;
  tempo_preparo?: number;
  variacoes?: Variacao[];
  adicionais?: Adicional[];
}

export interface Variacao {
  id: number;
  id_produto: number;
  nome: string;
  preco: number;
}

export interface Adicional {
  id: number;
  id_produto: number;
  nome: string;
  preco: number;
}

export async function listarProdutos(): Promise<Produto[]> {
  const connection = await pool.getConnection();
  try {
    const [produtos] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM produtos WHERE ativo = true ORDER BY id DESC`
    );

    // Buscar variações e adicionais para cada produto
    for (const produto of produtos) {
      const [variacoes] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM variacoes WHERE id_produto = ?`,
        [produto.id]
      );
      const [adicionais] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM adicionais WHERE id_produto = ?`,
        [produto.id]
      );
      
      produto.variacoes = variacoes as Variacao[];
      produto.adicionais = adicionais as Adicional[];
    }

    return produtos as Produto[];
  } finally {
    connection.release();
  }
}

export async function buscarProdutoPorId(id: number): Promise<Produto | null> {
  const connection = await pool.getConnection();
  try {
    const [produtos] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM produtos WHERE id = ?`,
      [id]
    );

    if (produtos.length === 0) {
      return null;
    }

    const produto = produtos[0];

    // Buscar variações e adicionais
    const [variacoes] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM variacoes WHERE id_produto = ?`,
      [id]
    );
    const [adicionais] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM adicionais WHERE id_produto = ?`,
      [id]
    );

    produto.variacoes = variacoes;
    produto.adicionais = adicionais;

    return produto as Produto;
  } finally {
    connection.release();
  }
}

export async function listarProdutosPorRestaurante(
  restaurantId: number
): Promise<Produto[]> {
  const connection = await pool.getConnection();
  try {
    const [produtos] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM produtos WHERE id_restaurantes = ? AND ativo = true ORDER BY id DESC`,
      [restaurantId]
    );

    for (const produto of produtos) {
      const [variacoes] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM variacoes WHERE id_produto = ?`,
        [produto.id]
      );
      const [adicionais] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM adicionais WHERE id_produto = ?`,
        [produto.id]
      );

      produto.variacoes = variacoes;
      produto.adicionais = adicionais;
    }

    return produtos as Produto[];
  } finally {
    connection.release();
  }
}

export async function listarProdutosPorCategoria(
  categoryId: number
): Promise<Produto[]> {
  const connection = await pool.getConnection();
  try {
    const [produtos] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM produtos WHERE id_categoria = ? AND ativo = true ORDER BY id DESC`,
      [categoryId]
    );

    for (const produto of produtos) {
      const [variacoes] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM variacoes WHERE id_produto = ?`,
        [produto.id]
      );
      const [adicionais] = await connection.query<RowDataPacket[]>(
        `SELECT * FROM adicionais WHERE id_produto = ?`,
        [produto.id]
      );

      produto.variacoes = variacoes;
      produto.adicionais = adicionais;
    }

    return produtos as Produto[];
  } finally {
    connection.release();
  }
}

export async function adicionarProduto(produto: Omit<Produto, "id">): Promise<Produto> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO produtos (nome, descricao, imagem, id_categoria, id_restaurantes, quantidade_estoque, ativo, destaque, avaliacao, total_avaliacoes, tempo_preparo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        produto.nome,
        produto.descricao || null,
        produto.imagem || null,
        produto.id_categoria,
        produto.id_restaurantes,
        produto.quantidade_estoque || 0,
        produto.ativo !== false,
        produto.destaque || false,
        produto.avaliacao || 0,
        produto.total_avaliacoes || 0,
        produto.tempo_preparo || null,
      ]
    );

    const produtoId = result.insertId;

    // Inserir variações se existirem
    if (produto.variacoes && produto.variacoes.length > 0) {
      for (const variacao of produto.variacoes) {
        await connection.query(
          `INSERT INTO variacoes (id_produto, nome, preco) VALUES (?, ?, ?)`,
          [produtoId, variacao.nome, variacao.preco]
        );
      }
    }

    // Inserir adicionais se existirem
    if (produto.adicionais && produto.adicionais.length > 0) {
      for (const adicional of produto.adicionais) {
        await connection.query(
          `INSERT INTO adicionais (id_produto, nome, preco) VALUES (?, ?, ?)`,
          [produtoId, adicional.nome, adicional.preco]
        );
      }
    }

    await connection.commit();

    return buscarProdutoPorId(produtoId) as Promise<Produto>;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function atualizarProduto(
  id: number,
  dados: Partial<Produto>
): Promise<Produto | null> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Montar query dinamicamente baseado nos campos fornecidos
    const campos: string[] = [];
    const valores: any[] = [];

    if (dados.nome !== undefined) {
      campos.push("nome = ?");
      valores.push(dados.nome);
    }
    if (dados.descricao !== undefined) {
      campos.push("descricao = ?");
      valores.push(dados.descricao);
    }
    if (dados.imagem !== undefined) {
      campos.push("imagem = ?");
      valores.push(dados.imagem);
    }
    if (dados.id_categoria !== undefined) {
      campos.push("id_categoria = ?");
      valores.push(dados.id_categoria);
    }
    if (dados.id_restaurantes !== undefined) {
      campos.push("id_restaurantes = ?");
      valores.push(dados.id_restaurantes);
    }
    if (dados.quantidade_estoque !== undefined) {
      campos.push("quantidade_estoque = ?");
      valores.push(dados.quantidade_estoque);
    }
    if (dados.ativo !== undefined) {
      campos.push("ativo = ?");
      valores.push(dados.ativo);
    }
    if (dados.destaque !== undefined) {
      campos.push("destaque = ?");
      valores.push(dados.destaque);
    }
    if (dados.avaliacao !== undefined) {
      campos.push("avaliacao = ?");
      valores.push(dados.avaliacao);
    }
    if (dados.total_avaliacoes !== undefined) {
      campos.push("total_avaliacoes = ?");
      valores.push(dados.total_avaliacoes);
    }
    if (dados.tempo_preparo !== undefined) {
      campos.push("tempo_preparo = ?");
      valores.push(dados.tempo_preparo);
    }

    if (campos.length === 0) {
      return buscarProdutoPorId(id);
    }

    valores.push(id);

    const [result] = await connection.query<ResultSetHeader>(
      `UPDATE produtos SET ${campos.join(", ")} WHERE id = ?`,
      valores
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return null;
    }

    // Atualizar variações se fornecidas
    if (dados.variacoes !== undefined) {
      // Remover variações antigas
      await connection.query(`DELETE FROM variacoes WHERE id_produto = ?`, [id]);

      // Inserir novas variações
      if (dados.variacoes.length > 0) {
        for (const variacao of dados.variacoes) {
          await connection.query(
            `INSERT INTO variacoes (id_produto, nome, preco) VALUES (?, ?, ?)`,
            [id, variacao.nome, variacao.preco]
          );
        }
      }
    }

    // Atualizar adicionais se fornecidos
    if (dados.adicionais !== undefined) {
      // Remover adicionais antigos
      await connection.query(`DELETE FROM adicionais WHERE id_produto = ?`, [id]);

      // Inserir novos adicionais
      if (dados.adicionais.length > 0) {
        for (const adicional of dados.adicionais) {
          await connection.query(
            `INSERT INTO adicionais (id_produto, nome, preco) VALUES (?, ?, ?)`,
            [id, adicional.nome, adicional.preco]
          );
        }
      }
    }

    await connection.commit();

    return buscarProdutoPorId(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function deletarProduto(id: number): Promise<boolean> {
  const connection = await pool.getConnection();
  try {
    // Verificar se o produto existe
    const [produtoExistente] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM produtos WHERE id = ?`,
      [id]
    );

    if (produtoExistente.length === 0) {
      throw new Error('Produto não encontrado');
    }

    // Verificar se existem pedidos associados ao produto
    const [pedidos] = await connection.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM itens_pedido WHERE id_produto = ?`,
      [id]
    );

    if (pedidos[0].total > 0) {
      throw new Error(
        'Não é possível deletar produto que possui pedidos associados. ' +
        `Este produto está em ${pedidos[0].total} pedido(s).`
      );
    }

    // Se passou nas validações, pode deletar
    const [result] = await connection.query<ResultSetHeader>(
      `DELETE FROM produtos WHERE id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
}
