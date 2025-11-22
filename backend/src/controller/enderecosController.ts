import type { Request, Response } from "express";
import pool from "../config/database";

export async function getEnderecos(req: Request, res: Response) {
  try {
    const { userId } = req.query;

    let query = "SELECT * FROM enderecos";
    const params: any[] = [];

    if (userId) {
      query += " WHERE id_cliente = ?";
      params.push(userId);
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
    const [rows] = await pool.query("SELECT * FROM enderecos WHERE id = ?", [id]);

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
    const { userId, street, number, complement, district, city, state } = req.body;

    if (!userId || !street || !number || !district) {
      return res.status(400).json({ erro: "Dados obrigatórios faltando" });
    }

    const id = crypto.randomUUID();
    const endereco = `${street}, ${number} - ${district}, ${city}/${state}`;

    const [result] = await pool.query(
      `INSERT INTO enderecos (id, id_cliente, rua, numero, complemento, bairro, endereco)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, street, number, complement || null, district, endereco]
    );

    res.status(201).json({ id, userId, street, number, complement, district, city, state });
  } catch (error: any) {
    console.error("Erro ao criar endereço:", error);
    res.status(400).json({ erro: error.message });
  }
}

export async function putEndereco(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { street, number, complement, district, city, state } = req.body;

    const endereco = `${street}, ${number} - ${district}, ${city}/${state}`;

    await pool.query(
      `UPDATE enderecos 
       SET rua = ?, numero = ?, complemento = ?, bairro = ?, endereco = ?
       WHERE id = ?`,
      [street, number, complement || null, district, endereco, id]
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
