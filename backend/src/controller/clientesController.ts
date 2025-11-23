import { Request, Response } from "express";
import * as service from "../service/autenticacaoServiceDB";

/**
 * Lista todos os clientes
 */
export async function listarClientes(req: Request, res: Response) {
  try {
    const clientes = await service.listarUsuarios();
    res.json(clientes);
  } catch (erro: any) {
    console.error("Erro ao listar clientes:", erro);
    res.status(500).json({ erro: erro.message });
  }
}

/**
 * Busca um cliente por ID
 */
export async function buscarCliente(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const cliente = await service.buscarUsuarioPorId(id);

    if (!cliente) {
      return res.status(404).json({ erro: "Cliente não encontrado" });
    }

    res.json(cliente);
  } catch (erro: any) {
    console.error("Erro ao buscar cliente:", erro);
    res.status(500).json({ erro: erro.message });
  }
}

/**
 * Atualiza um cliente
 */
export async function atualizarCliente(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const dados = req.body;

    // Remover campos que não devem ser atualizados
    delete dados.id;
    delete dados.email;
    delete dados.role;
    delete dados.createdAt;
    delete dados.password;

    const cliente = await service.atualizarUsuario(id, dados);

    if (!cliente) {
      return res.status(404).json({ erro: "Cliente não encontrado" });
    }

    res.json(cliente);
  } catch (erro: any) {
    console.error("Erro ao atualizar cliente:", erro);
    res.status(500).json({ erro: erro.message });
  }
}

/**
 * Alterna o status ativo/inativo de um cliente
 */
export async function alternarStatusCliente(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Buscar cliente atual
    const clienteAtual = await service.buscarUsuarioPorId(id);

    if (!clienteAtual) {
      return res.status(404).json({ erro: "Cliente não encontrado" });
    }

    // Alternar status
    const cliente = await service.atualizarUsuario(id, {
      isActive: !clienteAtual.isActive,
    });

    res.json(cliente);
  } catch (erro: any) {
    console.error("Erro ao alternar status do cliente:", erro);
    res.status(500).json({ erro: erro.message });
  }
}

/**
 * Deleta um cliente
 */
export async function deletarCliente(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const sucesso = await service.deletarUsuario(id);

    if (!sucesso) {
      return res.status(404).json({ erro: "Cliente não encontrado" });
    }

    res.json({ mensagem: "Cliente deletado com sucesso" });
  } catch (erro: any) {
    console.error("Erro ao deletar cliente:", erro);
    res.status(500).json({ erro: erro.message });
  }
}
