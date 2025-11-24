import pool from "../config/database";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export interface PedidoItem {
  productId: string;
  productName: string;
  variationId?: string;
  variationName?: string;
  quantity: number;
  subtotal: number;
  product?: {
    id: string;
    name: string;
    image: string;
  };
}

export interface Pedido {
  id: number | string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  restaurantId: number;
  restaurantName: string;
  items: PedidoItem[];
  deliveryAddress: string;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Lista todos os pedidos
 */
export async function listarPedidos(): Promise<Pedido[]> {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query(
      `SELECT * FROM pedidos ORDER BY criado_em DESC`
    );

    const pedidos: Pedido[] = [];
    
    for (const row of (rows as any[])) {
      // Buscar itens do pedido
      const [items] = await connection.query(
        `SELECT * FROM itens_pedido WHERE id_pedido = ?`,
        [row.id]
      );

      row.items = (items as any[]).map(item => ({
        productId: item.id_produto,
        productName: item.nome_produto,
        variationId: item.id_variacao,
        variationName: item.nome_variacao,
        quantity: item.quantidade,
        subtotal: item.subtotal,
      }));

      pedidos.push(formatarPedido(row));
    }

    return pedidos;
  } finally {
    connection.release();
  }
}

/**
 * Busca um pedido por ID
 */
export async function buscarPedido(id: string): Promise<Pedido | null> {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query(
      `SELECT * FROM pedidos WHERE id = ?`,
      [id]
    );

    if ((rows as any[]).length === 0) {
      return null;
    }

    const pedido = (rows as any[])[0];
    
    // Buscar itens do pedido com informações do produto
    const [items] = await connection.query(
      `SELECT ip.*, p.imagem as produto_imagem 
       FROM itens_pedido ip
       LEFT JOIN produtos p ON ip.id_produto = p.id
       WHERE ip.id_pedido = ?`,
      [id]
    );

    pedido.items = (items as any[]).map(item => ({
      productId: item.id_produto,
      productName: item.nome_produto,
      variationId: item.id_variacao,
      variationName: item.nome_variacao,
      quantity: item.quantidade,
      subtotal: item.subtotal,
      product: {
        id: item.id_produto,
        name: item.nome_produto,
        image: item.produto_imagem || '',
      }
    }));

    return formatarPedido(pedido);
  } finally {
    connection.release();
  }
}

/**
 * Lista pedidos de um cliente
 */
export async function listarPedidosPorCliente(customerId: string): Promise<Pedido[]> {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query(
      `SELECT * FROM pedidos WHERE id_cliente = ? ORDER BY criado_em DESC`,
      [customerId]
    );

    const pedidos: Pedido[] = [];
    
    for (const row of (rows as any[])) {
      // Buscar itens do pedido com informações do produto
      const [items] = await connection.query(
        `SELECT ip.*, p.imagem as produto_imagem 
         FROM itens_pedido ip
         LEFT JOIN produtos p ON ip.id_produto = p.id
         WHERE ip.id_pedido = ?`,
        [row.id]
      );

      row.items = (items as any[]).map(item => ({
        productId: item.id_produto,
        productName: item.nome_produto,
        variationId: item.id_variacao,
        variationName: item.nome_variacao,
        quantity: item.quantidade,
        subtotal: item.subtotal,
        product: {
          id: item.id_produto,
          name: item.nome_produto,
          image: item.produto_imagem || '',
        }
      }));

      pedidos.push(formatarPedido(row));
    }

    return pedidos;
  } finally {
    connection.release();
  }
}

/**
 * Lista pedidos de um restaurante
 */
export async function listarPedidosPorRestaurante(restaurantId: string): Promise<Pedido[]> {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query(
      `SELECT * FROM pedidos WHERE id_restaurantes = ? ORDER BY criado_em DESC`,
      [restaurantId]
    );

    const pedidos: Pedido[] = [];
    
    for (const row of (rows as any[])) {
      // Buscar itens do pedido com informações do produto
      const [items] = await connection.query(
        `SELECT ip.*, p.imagem as produto_imagem 
         FROM itens_pedido ip
         LEFT JOIN produtos p ON ip.id_produto = p.id
         WHERE ip.id_pedido = ?`,
        [row.id]
      );

      row.items = (items as any[]).map(item => ({
        productId: item.id_produto,
        productName: item.nome_produto,
        variationId: item.id_variacao,
        variationName: item.nome_variacao,
        quantity: item.quantidade,
        subtotal: item.subtotal,
        product: {
          id: item.id_produto,
          name: item.nome_produto,
          image: item.produto_imagem || '',
        }
      }));

      pedidos.push(formatarPedido(row));
    }

    return pedidos;
  } finally {
    connection.release();
  }
}

/**
 * Cria um novo pedido
 */
export async function adicionarPedido(dados: any): Promise<Pedido> {
  const connection = await pool.getConnection();

  try {
    // Converter customerId para número se necessário
    let idCliente = parseInt(dados.customerId, 10);
    if (isNaN(idCliente)) {
      // Se for email, buscar o ID
      const [rows] = await connection.query(
        `SELECT id FROM clientes WHERE email = ? LIMIT 1`,
        [dados.customerId]
      );
      if ((rows as any[]).length > 0) {
        idCliente = (rows as any[])[0].id;
      } else {
        throw new Error("Cliente não encontrado");
      }
    }

    // Inserir pedido
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO pedidos (
        id_cliente, nome_cliente, telefone_cliente, id_restaurantes, 
        nome_restaurante, metodo_pagamento, subtotal, taxa_entrega, 
        desconto, total, status, endereco_entrega
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        idCliente,
        dados.customerName,
        dados.customerPhone,
        dados.restaurantId || 1,
        dados.restaurantName,
        dados.paymentMethod,
        dados.subtotal,
        dados.deliveryFee,
        dados.discount,
        dados.total,
        dados.status || 'pending',
        dados.deliveryAddress
      ]
    );

    const pedidoId = result.insertId;

        // Inserir itens do pedido
    if (dados.items && Array.isArray(dados.items)) {
      for (const item of dados.items) {
        // Validar se o produto existe
        const productId = item.productId;
        if (!productId) {
          throw new Error("Cada item do pedido deve ter um productId válido");
        }

        const [produtoCheck] = await connection.query(
          `SELECT id FROM produtos WHERE id = ?`,
          [productId]
        );

        if ((produtoCheck as any[]).length === 0) {
          throw new Error(`Produto com ID ${productId} não encontrado`);
        }

        // Garantir que variationId seja null ou um número válido
        let variationId: number | null = null;
        if (item.variationId) {
          const parsed = parseInt(item.variationId, 10);
          if (!isNaN(parsed) && parsed > 0) {
            variationId = parsed;
          }
        }

        await connection.query(
          `INSERT INTO itens_pedido (
            id_pedido, id_produto, nome_produto, id_variacao, 
            nome_variacao, quantidade, subtotal
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            pedidoId,
            productId,
            item.productName,
            variationId,
            item.variationName || null,
            item.quantity,
            item.subtotal
          ]
        );
      }
    }    // Retornar o pedido criado
    const pedidoCriado = await buscarPedido(pedidoId.toString());
    if (!pedidoCriado) {
      throw new Error("Erro ao buscar pedido criado");
    }

    return pedidoCriado;
  } finally {
    connection.release();
  }
}

/**
 * Atualiza o status de um pedido
 */
export async function atualizarStatusPedido(
  id: string,
  status: string
): Promise<Pedido | null> {
  const connection = await pool.getConnection();

  try {
    // Buscar o pedido antes de atualizar para obter os dados
    const pedido = await buscarPedido(id);
    if (!pedido) {
      return null;
    }

    // Atualizar status
    await connection.query(
      `UPDATE pedidos SET status = ? WHERE id = ?`,
      [status, id]
    );

    return await buscarPedido(id);
  } finally {
    connection.release();
  }
}

/**
 * Atualiza um pedido
 */
export async function atualizarPedido(id: string, dados: any): Promise<Pedido | null> {
  const connection = await pool.getConnection();

  try {
    const campos: string[] = [];
    const valores: any[] = [];

    if (dados.status) {
      campos.push("status = ?");
      valores.push(dados.status);
    }

    if (dados.metodo_pagamento) {
      campos.push("metodo_pagamento = ?");
      valores.push(dados.metodo_pagamento);
    }

    if (campos.length > 0) {
      valores.push(id);
      await connection.query(
        `UPDATE pedidos SET ${campos.join(", ")} WHERE id = ?`,
        valores
      );
    }

    return await buscarPedido(id);
  } finally {
    connection.release();
  }
}

/**
 * Retorna todos os itens de pedidos com contagem de vendas
 */
export async function listarItensVendas() {
  const connection = await pool.getConnection();

  try {
    console.log('📊 Iniciando listarItensVendas...');
    
    // Buscar todos os itens dos pedidos com informações do produto
    const [items] = await connection.query(
      `SELECT 
        ip.id_produto as productId,
        MAX(COALESCE(p.nome, ip.nome_produto)) as productName,
        MAX(p.imagem) as image,
        SUM(ip.quantidade) as totalQuantity,
        COUNT(DISTINCT ip.id_pedido) as timesOrdered,
        SUM(ip.subtotal) as totalRevenue
       FROM itens_pedido ip
       LEFT JOIN produtos p ON ip.id_produto = p.id
       WHERE p.id IS NOT NULL
       GROUP BY ip.id_produto
       ORDER BY totalQuantity DESC`
    );

    console.log('📊 Itens encontrados:', items);

    return (items as any[]).map(item => ({
      productId: item.productId,
      productName: item.productName,
      image: item.image || '',
      totalQuantity: item.totalQuantity || 0,
      timesOrdered: item.timesOrdered || 0,
      totalRevenue: item.totalRevenue || 0,
    }));
  } catch (error) {
    console.error('❌ Erro em listarItensVendas:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Formata um pedido do banco para o formato esperado pela API
 */
function formatarPedido(row: any): Pedido {
  return {
    id: row.id,
    customerId: row.id_cliente,
    customerName: row.nome_cliente,
    customerPhone: row.telefone_cliente,
    restaurantId: row.id_restaurantes,
    restaurantName: row.nome_restaurante,
    items: row.items || [],
    deliveryAddress: row.endereco_entrega,
    paymentMethod: row.metodo_pagamento,
    subtotal: row.subtotal,
    deliveryFee: row.taxa_entrega,
    discount: row.desconto,
    total: row.total,
    status: row.status,
    createdAt: row.criado_em,
    updatedAt: row.atualizado_em,
  };
}
