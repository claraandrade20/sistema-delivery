import type { Request, Response } from "express";
import * as service from "../service/produtos";

export function getProdutos(req: Request, res: Response) {
  try {
    const { restaurantId, categoryId } = req.query;

    let produtos;
    if (restaurantId) {
      produtos = service.listarProdutosPorRestaurante(restaurantId as string);
    } else if (categoryId) {
      produtos = service.listarProdutosPorCategoria(categoryId as string);
    } else {
      produtos = service.listarProdutos();
    }

    res.json(produtos);
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}

export function getProdutoById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const produto = service.buscarProdutoPorId(id);

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json(produto);
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}

export function postProduto(req: Request, res: Response) {
  try {
    const novo = service.adicionarProduto(req.body);
    res.status(201).json(novo);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
}

export function putProduto(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const atualizado = service.atualizarProduto(id, req.body);

    if (!atualizado) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.json(atualizado);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
}

export function deleteProduto(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deletado = service.deletarProduto(id);

    if (!deletado) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}
