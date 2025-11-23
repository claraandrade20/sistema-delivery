import { Request, Response } from "express";
import pool from "../config/database";

export class CuponsController {
  // Listar todos os cupons
  static async listarCupons(req: Request, res: Response) {
    try {
      const [cupons] = await pool.query(
        `SELECT * FROM cupons ORDER BY criado_em DESC`
      );

      res.status(200).json({
        sucesso: true,
        dados: cupons,
        total: (cupons as any[]).length,
      });
    } catch (error) {
      console.error("Erro ao listar cupons:", error);
      res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao listar cupons",
        erro: (error as any).message,
      });
    }
  }

  // Obter cupom por ID
  static async obterCupom(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const [cupom] = await pool.query(
        `SELECT * FROM cupons WHERE id = ?`,
        [id]
      );

      if ((cupom as any[]).length === 0) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Cupom não encontrado",
        });
      }

      res.status(200).json({
        sucesso: true,
        dados: (cupom as any[])[0],
      });
    } catch (error) {
      console.error("Erro ao obter cupom:", error);
      res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao obter cupom",
        erro: (error as any).message,
      });
    }
  }

  // Obter cupom por código
  static async obterCuponPorCodigo(req: Request, res: Response) {
    try {
      const { codigo } = req.params;

      const [cupom] = await pool.query(
        `SELECT * FROM cupons WHERE codigo = ? AND ativo = true`,
        [codigo]
      );

      if ((cupom as any[]).length === 0) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Cupom não encontrado ou inativo",
        });
      }

      const cupomData = (cupom as any[])[0];

      // Verificar se o cupom está dentro do período de validade
      const dataAtual = new Date();
      if (
        dataAtual < new Date(cupomData.data_inicio) ||
        dataAtual > new Date(cupomData.data_fim)
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Cupom expirado ou não está ativo",
        });
      }

      // Verificar se ainda há usos disponíveis
      if (cupomData.quantidade_usada >= cupomData.quantidade_total) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Cupom exaurido",
        });
      }

      res.status(200).json({
        sucesso: true,
        dados: cupomData,
      });
    } catch (error) {
      console.error("Erro ao obter cupom:", error);
      res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao obter cupom",
        erro: (error as any).message,
      });
    }
  }

  // Criar novo cupom
  static async criarCupom(req: Request, res: Response) {
    try {
      const {
        codigo,
        descricao,
        tipoDesconto,
        valorDesconto,
        usoMinimo,
        quantidadeTotal,
        dataInicio,
        dataFim,
      } = req.body;

      // Validar dados obrigatórios
      if (
        !codigo ||
        !tipoDesconto ||
        valorDesconto === undefined ||
        !quantidadeTotal ||
        !dataInicio ||
        !dataFim
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Dados obrigatórios faltando",
        });
      }

      // Verificar se código já existe
      const [cupomExistente] = await pool.query(
        `SELECT id FROM cupons WHERE codigo = ?`,
        [codigo]
      );

      if ((cupomExistente as any[]).length > 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Cupom com este código já existe",
        });
      }

      // Inserir novo cupom
      const [result] = await pool.query(
        `INSERT INTO cupons (codigo, descricao, tipo_desconto, valor_desconto, uso_minimo, quantidade_total, ativo, data_inicio, data_fim)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          codigo,
          descricao || null,
          tipoDesconto,
          valorDesconto,
          usoMinimo || 0,
          quantidadeTotal,
          true,
          dataInicio,
          dataFim,
        ]
      );

      res.status(201).json({
        sucesso: true,
        mensagem: "Cupom criado com sucesso",
        dados: {
          id: (result as any).insertId,
          codigo,
          descricao,
          tipoDesconto,
          valorDesconto,
          usoMinimo,
          quantidadeTotal,
        },
      });
    } catch (error) {
      console.error("Erro ao criar cupom:", error);
      res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao criar cupom",
        erro: (error as any).message,
      });
    }
  }

  // Atualizar cupom
  static async atualizarCupom(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        descricao,
        tipoDesconto,
        valorDesconto,
        usoMinimo,
        quantidadeTotal,
        ativo,
        dataInicio,
        dataFim,
      } = req.body;

      // Verificar se cupom existe
      const [cupomExistente] = await pool.query(
        `SELECT * FROM cupons WHERE id = ?`,
        [id]
      );

      if ((cupomExistente as any[]).length === 0) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Cupom não encontrado",
        });
      }

      // Construir query dinamicamente
      const campos = [];
      const valores: any[] = [];

      if (descricao !== undefined) {
        campos.push("descricao = ?");
        valores.push(descricao);
      }
      if (tipoDesconto !== undefined) {
        campos.push("tipo_desconto = ?");
        valores.push(tipoDesconto);
      }
      if (valorDesconto !== undefined) {
        campos.push("valor_desconto = ?");
        valores.push(valorDesconto);
      }
      if (usoMinimo !== undefined) {
        campos.push("uso_minimo = ?");
        valores.push(usoMinimo);
      }
      if (quantidadeTotal !== undefined) {
        campos.push("quantidade_total = ?");
        valores.push(quantidadeTotal);
      }
      if (ativo !== undefined) {
        campos.push("ativo = ?");
        valores.push(ativo);
      }
      if (dataInicio !== undefined) {
        campos.push("data_inicio = ?");
        valores.push(dataInicio);
      }
      if (dataFim !== undefined) {
        campos.push("data_fim = ?");
        valores.push(dataFim);
      }

      if (campos.length === 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Nenhum campo para atualizar",
        });
      }

      valores.push(id);

      await pool.query(
        `UPDATE cupons SET ${campos.join(", ")} WHERE id = ?`,
        valores
      );

      res.status(200).json({
        sucesso: true,
        mensagem: "Cupom atualizado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar cupom:", error);
      res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao atualizar cupom",
        erro: (error as any).message,
      });
    }
  }

  // Deletar cupom
  static async deletarCupom(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se cupom existe
      const [cupomExistente] = await pool.query(
        `SELECT * FROM cupons WHERE id = ?`,
        [id]
      );

      if ((cupomExistente as any[]).length === 0) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Cupom não encontrado",
        });
      }

      await pool.query(`DELETE FROM cupons WHERE id = ?`, [id]);

      res.status(200).json({
        sucesso: true,
        mensagem: "Cupom deletado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao deletar cupom:", error);
      res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao deletar cupom",
        erro: (error as any).message,
      });
    }
  }

  // Usar cupom (incrementar quantidade usada)
  static async usarCupom(req: Request, res: Response) {
    try {
      const { codigo } = req.body;

      if (!codigo) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Código do cupom é obrigatório",
        });
      }

      // Obter cupom
      const [cupom] = await pool.query(
        `SELECT * FROM cupons WHERE codigo = ?`,
        [codigo]
      );

      if ((cupom as any[]).length === 0) {
        return res.status(404).json({
          sucesso: false,
          mensagem: "Cupom não encontrado",
        });
      }

      const cupomData = (cupom as any[])[0];

      // Validações
      if (!cupomData.ativo) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Cupom inativo",
        });
      }

      const dataAtual = new Date();
      if (
        dataAtual < new Date(cupomData.data_inicio) ||
        dataAtual > new Date(cupomData.data_fim)
      ) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Cupom expirado",
        });
      }

      if (cupomData.quantidade_usada >= cupomData.quantidade_total) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Cupom exaurido",
        });
      }

      // Incrementar quantidade usada
      await pool.query(
        `UPDATE cupons SET quantidade_usada = quantidade_usada + 1 WHERE id = ?`,
        [cupomData.id]
      );

      res.status(200).json({
        sucesso: true,
        mensagem: "Cupom utilizado com sucesso",
        dados: {
          desconto: cupomData.valor_desconto,
          tipo: cupomData.tipo_desconto,
          usoMinimo: cupomData.uso_minimo,
        },
      });
    } catch (error) {
      console.error("Erro ao usar cupom:", error);
      res.status(500).json({
        sucesso: false,
        mensagem: "Erro ao usar cupom",
        erro: (error as any).message,
      });
    }
  }
}
