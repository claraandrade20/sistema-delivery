import type { Request, Response } from "express";
import * as service from "../service/produtosServiceDB";

export async function getProdutos(req: Request, res: Response) {
  try {
    const { restaurantId, categoryId } = req.query;

    let produtos;
    if (restaurantId) {
      produtos = await service.listarProdutosPorRestaurante(Number(restaurantId));
    } else if (categoryId) {
      produtos = await service.listarProdutosPorCategoria(Number(categoryId));
    } else {
      produtos = await service.listarProdutos();
    }

    res.json(produtos);
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}

export async function getProdutoById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const produto = await service.buscarProdutoPorId(Number(id));

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json(produto);
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}

export async function postProduto(req: Request, res: Response) {
  try {
    const novo = await service.adicionarProduto(req.body);
    res.status(201).json(novo);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
}

export async function putProduto(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const atualizado = await service.atualizarProduto(Number(id), req.body);

    if (!atualizado) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json(atualizado);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
}

export async function deleteProduto(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deletado = await service.deletarProduto(Number(id));

    if (!deletado) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.status(204).send();
  } catch (error: any) {
    // Se o erro for de validação (produto com pedidos), retornar 409 (Conflict)
    if (error.message.includes('pedidos associados')) {
      return res.status(409).json({ erro: error.message });
    }
    
    // Outros erros retornam 500
    res.status(500).json({ erro: error.message || "Erro ao deletar produto" });
  }
}
