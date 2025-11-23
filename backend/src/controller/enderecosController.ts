import type { Request, Response } from "express";
import pool from "../config/database";

/**
 * Busca o ID numérico do cliente pelo email
 */
async function obterIdClientePorEmail(email: string): Promise<number | null> {
  try {
    const [rows] = await pool.query(
      "SELECT id FROM clientes WHERE email = ? LIMIT 1",
      [email]
    );
    
    if ((rows as any[]).length > 0) {
      return (rows as any[])[0].id;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar cliente por email:", error);
    return null;
  }
}

export async function getEnderecos(req: Request, res: Response) {
  try {
    const { userId } = req.query;

    let query = `
      SELECT 
        id,
        id_cliente,
        rua as street,
        numero as number,
        complemento as complement,
        bairro as district,
        cidade as city,
        estado as state,
        status
      FROM enderecos
    `;
    const params: any[] = [];

    if (userId) {
      // Se userId é um email, buscar o ID numérico
      if (typeof userId === 'string' && userId.includes('@')) {
        const clienteId = await obterIdClientePorEmail(userId as string);
        if (clienteId === null) {
          return res.status(404).json({ erro: "Cliente não encontrado" });
        }
        query += " WHERE id_cliente = ?";
        params.push(clienteId);
      } else {
        query += " WHERE id_cliente = ?";
        params.push(userId);
      }
    }

    const [rows] = await pool.query(query, params);

    res.json(rows);
  } catch (error: any) {
    console.error("Erro ao listar endereços:", error);
    res.status(500).json({ erro: error.message });
  }
}

export async function getEnderecoById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT 
        id,
        id_cliente,
        rua as street,
        numero as number,
        complemento as complement,
        bairro as district,
        cidade as city,
        estado as state,
        status
      FROM enderecos 
      WHERE id = ?`, 
      [id]
    );

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ erro: "Endereço não encontrado" });
    }

    res.json((rows as any[])[0]);
  } catch (error: any) {
    console.error("Erro ao buscar endereço:", error);
    res.status(500).json({ erro: error.message });
  }
}

export async function postEndereco(req: Request, res: Response) {
  try {
    const { userId, street, number, complement, district, city, state, status } = req.body;

    console.log("📍 [ENDERECO] Dados recebidos:", { userId, street, number, district, status });

    if (!userId || !street || !number || !district) {
      return res.status(400).json({ erro: "Dados obrigatórios faltando" });
    }

    // Se userId é um email, buscar o ID numérico
    let clienteId: number;
    if (typeof userId === 'string' && userId.includes('@')) {
      console.log("📍 [ENDERECO] Buscando cliente por email:", userId);
      const id = await obterIdClientePorEmail(userId);
      console.log("📍 [ENDERECO] ID encontrado:", id);
      if (id === null) {
        return res.status(404).json({ erro: "Cliente não encontrado" });
      }
      clienteId = id;
    } else {
      clienteId = parseInt(userId, 10);
      if (isNaN(clienteId)) {
        return res.status(400).json({ erro: "ID de cliente inválido" });
      }
    }

    const endereco = `${street}, ${number} - ${district}, ${city}/${state}`;
    const enderecoStatus = status === 'principal' ? 'principal' : 'secundario';

    const [result] = await pool.query(
      `INSERT INTO enderecos (id_cliente, rua, numero, complemento, bairro, cidade, estado, endereco, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [clienteId, street, number, complement || null, district, city, state, endereco, enderecoStatus]
    );

    const insertId = (result as any).insertId;
    
    res.status(201).json({ id: insertId, userId: clienteId, street, number, complement, district, city, state, status: enderecoStatus });
  } catch (error: any) {
    console.error("Erro ao criar endereço:", error);
    res.status(400).json({ erro: error.message });
  }
}

export async function putEndereco(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { street, number, complement, district, city, state, status } = req.body;

    const endereco = `${street}, ${number} - ${district}, ${city}/${state}`;
    const enderecoStatus = status === 'principal' ? 'principal' : 'secundario';

    await pool.query(
      `UPDATE enderecos 
       SET rua = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, estado = ?, endereco = ?, status = ?
       WHERE id = ?`,
      [street, number, complement || null, district, city, state, endereco, enderecoStatus, id]
    );

    const [rows] = await pool.query("SELECT * FROM enderecos WHERE id = ?", [id]);

    if ((rows as any[]).length === 0) {
      return res.status(404).json({ erro: "Endereço não encontrado" });
    }

    res.json((rows as any[])[0]);
  } catch (error: any) {
    console.error("Erro ao atualizar endereço:", error);
    res.status(400).json({ erro: error.message });
  }
}

export async function deleteEndereco(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM enderecos WHERE id = ?", [id]);

    res.json({ mensagem: "Endereço deletado com sucesso", id });
  } catch (error: any) {
    console.error("Erro ao deletar endereço:", error);
    res.status(500).json({ erro: error.message });
  }
}
