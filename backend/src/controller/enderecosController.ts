import type { Request, Response } from "express";
import pool from "../config/database";

export async function getEnderecos(req: Request, res: Response) {
  try {
    const { userId } = req.query;

    let query = "SELECT * FROM enderecos";
    const params: any[] = [];

    if (userId) {
      query += " WHERE usuario_id = ?";
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
    const { userId, cep, street, number, complement, district, city, state } = req.body;

    if (!userId || !cep || !street || !number || !district || !city || !state) {
      return res.status(400).json({ erro: "Dados obrigatórios faltando" });
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const [result] = await pool.query(
      `INSERT INTO enderecos (id, usuario_id, cep, endereco, numero, complemento, bairro, cidade, estado, criado_em)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, cep, street, number, complement || null, district, city, state, createdAt]
    );

    res.status(201).json({ id, userId, cep, street, number, complement, district, city, state, createdAt });
  } catch (error: any) {
    console.error("Erro ao criar endereço:", error);
    res.status(400).json({ erro: error.message });
  }
}

export async function putEndereco(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { cep, street, number, complement, district, city, state } = req.body;

    await pool.query(
      `UPDATE enderecos 
       SET cep = ?, endereco = ?, numero = ?, complemento = ?, bairro = ?, cidade = ?, estado = ?
       WHERE id = ?`,
      [cep, street, number, complement || null, district, city, state, id]
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

    const [result] = await pool.query("DELETE FROM enderecos WHERE id = ?", [id]);

    res.json({ mensagem: "Endereço deletado com sucesso", id });
  } catch (error: any) {
    console.error("Erro ao deletar endereço:", error);
    res.status(500).json({ erro: error.message });
  }
}
