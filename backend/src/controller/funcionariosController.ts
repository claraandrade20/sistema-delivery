import { Request, Response } from "express";
import pool from "../config/database";
import { ResultSetHeader } from "mysql2/promise";
import bcrypt from "bcryptjs";

/**
 * Lista todos os funcionários
 */
export async function listarFuncionarios(req: Request, res: Response) {
  const connection = await pool.getConnection();

  try {
    const [funcionarios] = await connection.query<any[]>(
      `SELECT id, nome, email, telefone, id_restaurantes, ativo, criado_em 
       FROM usuarios 
       WHERE funcao = 'funcionario'
       ORDER BY nome`
    );

    const resultado = funcionarios.map((f) => ({
      id: f.id.toString(),
      name: f.nome,
      email: f.email,
      phone: f.telefone,
      role: "employee" as const,
      restaurantId: f.id_restaurantes.toString(),
      isActive: f.ativo,
      createdAt: f.criado_em,
    }));

    res.json(resultado);
  } catch (erro: any) {
    console.error("Erro ao listar funcionários:", erro);
    res.status(500).json({ erro: erro.message });
  } finally {
    connection.release();
  }
}

/**
 * Busca um funcionário por ID
 */
export async function buscarFuncionario(req: Request, res: Response) {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const [funcionarios] = await connection.query<any[]>(
      `SELECT id, nome, email, telefone, id_restaurantes, ativo, criado_em 
       FROM usuarios 
       WHERE id = ? AND funcao = 'funcionario'`,
      [id]
    );

    if (funcionarios.length === 0) {
      return res.status(404).json({ erro: "Funcionário não encontrado" });
    }

    const f = funcionarios[0];
    const resultado = {
      id: f.id.toString(),
      name: f.nome,
      email: f.email,
      phone: f.telefone,
      role: "employee" as const,
      restaurantId: f.id_restaurantes.toString(),
      isActive: f.ativo,
      createdAt: f.criado_em,
    };

    res.json(resultado);
  } catch (erro: any) {
    console.error("Erro ao buscar funcionário:", erro);
    res.status(500).json({ erro: erro.message });
  } finally {
    connection.release();
  }
}

/**
 * Cria um novo funcionário
 */
export async function criarFuncionario(req: Request, res: Response) {
  const connection = await pool.getConnection();

  try {
    const { name, email, phone, password, restaurantId } = req.body;

    // Validar dados obrigatórios
    if (!name || !email || !password || !restaurantId) {
      return res.status(400).json({ erro: "Dados obrigatórios faltando" });
    }

    // Verificar se email já existe
    const [existentes] = await connection.query<any[]>(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (existentes.length > 0) {
      return res.status(400).json({ erro: "Email já cadastrado" });
    }

    // Hash da senha
    const senhaHash = bcrypt.hashSync(password, 10);

    // Inserir funcionário
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO usuarios (nome, email, senha, telefone, funcao, id_restaurantes, ativo)
       VALUES (?, ?, ?, ?, 'funcionario', ?, true)`,
      [name, email, senhaHash, phone || null, parseInt(restaurantId)]
    );

    const novoFuncionario = {
      id: result.insertId.toString(),
      name,
      email,
      phone: phone || null,
      role: "employee" as const,
      restaurantId: restaurantId.toString(),
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    res.status(201).json(novoFuncionario);
  } catch (erro: any) {
    console.error("Erro ao criar funcionário:", erro);
    res.status(500).json({ erro: erro.message });
  } finally {
    connection.release();
  }
}

/**
 * Atualiza um funcionário
 */
export async function atualizarFuncionario(req: Request, res: Response) {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { name, phone, restaurantId } = req.body;

    const campos: string[] = [];
    const valores: any[] = [];

    if (name) {
      campos.push("nome = ?");
      valores.push(name);
    }
    if (phone !== undefined) {
      campos.push("telefone = ?");
      valores.push(phone);
    }
    if (restaurantId) {
      campos.push("id_restaurantes = ?");
      valores.push(parseInt(restaurantId));
    }

    if (campos.length === 0) {
      return res.status(400).json({ erro: "Nenhum campo para atualizar" });
    }

    valores.push(id);

    await connection.query<ResultSetHeader>(
      `UPDATE usuarios SET ${campos.join(", ")} WHERE id = ? AND funcao = 'funcionario'`,
      valores
    );

    // Buscar funcionário atualizado
    const [funcionarios] = await connection.query<any[]>(
      `SELECT id, nome, email, telefone, id_restaurantes, ativo, criado_em 
       FROM usuarios 
       WHERE id = ? AND funcao = 'funcionario'`,
      [id]
    );

    if (funcionarios.length === 0) {
      return res.status(404).json({ erro: "Funcionário não encontrado" });
    }

    const f = funcionarios[0];
    const resultado = {
      id: f.id.toString(),
      name: f.nome,
      email: f.email,
      phone: f.telefone,
      role: "employee" as const,
      restaurantId: f.id_restaurantes.toString(),
      isActive: f.ativo,
      createdAt: f.criado_em,
    };

    res.json(resultado);
  } catch (erro: any) {
    console.error("Erro ao atualizar funcionário:", erro);
    res.status(500).json({ erro: erro.message });
  } finally {
    connection.release();
  }
}

/**
 * Alterna o status ativo/inativo de um funcionário
 */
export async function alternarStatusFuncionario(req: Request, res: Response) {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    // Buscar status atual
    const [funcionarios] = await connection.query<any[]>(
      "SELECT ativo FROM usuarios WHERE id = ? AND funcao = 'funcionario'",
      [id]
    );

    if (funcionarios.length === 0) {
      return res.status(404).json({ erro: "Funcionário não encontrado" });
    }

    const novoStatus = !funcionarios[0].ativo;

    // Atualizar status
    await connection.query<ResultSetHeader>(
      "UPDATE usuarios SET ativo = ? WHERE id = ? AND funcao = 'funcionario'",
      [novoStatus, id]
    );

    // Buscar funcionário atualizado
    const [atualizados] = await connection.query<any[]>(
      `SELECT id, nome, email, telefone, id_restaurantes, ativo, criado_em 
       FROM usuarios 
       WHERE id = ? AND funcao = 'funcionario'`,
      [id]
    );

    const f = atualizados[0];
    const resultado = {
      id: f.id.toString(),
      name: f.nome,
      email: f.email,
      phone: f.telefone,
      role: "employee" as const,
      restaurantId: f.id_restaurantes.toString(),
      isActive: f.ativo,
      createdAt: f.criado_em,
    };

    res.json(resultado);
  } catch (erro: any) {
    console.error("Erro ao alternar status do funcionário:", erro);
    res.status(500).json({ erro: erro.message });
  } finally {
    connection.release();
  }
}

/**
 * Deleta um funcionário
 */
export async function deletarFuncionario(req: Request, res: Response) {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const [result] = await connection.query<ResultSetHeader>(
      "DELETE FROM usuarios WHERE id = ? AND funcao = 'funcionario'",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Funcionário não encontrado" });
    }

    res.json({ mensagem: "Funcionário deletado com sucesso" });
  } catch (erro: any) {
    console.error("Erro ao deletar funcionário:", erro);
    res.status(500).json({ erro: erro.message });
  } finally {
    connection.release();
  }
}
