import type { Request, Response } from "express";
import * as service from "../service/pedidosServiceDB";

export async function getPedidos(req: Request, res: Response) {
  try {
    const { customerId, restaurantId } = req.query;

    let pedidos;
    if (customerId) {
      pedidos = await service.listarPedidosPorCliente(customerId as string);
    } else if (restaurantId) {
      pedidos = await service.listarPedidosPorRestaurante(restaurantId as string);
    } else {
      pedidos = await service.listarPedidos();
    }

    res.json(pedidos);
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}

export async function getPedidoById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const pedido = await service.buscarPedido(id);

    if (!pedido) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    res.json(pedido);
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}

export async function criarPedido(req: Request, res: Response) {
  try {
    const novo = await service.adicionarPedido(req.body);
    res.status(201).json(novo);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
}

export async function atualizarStatusPedido(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ erro: "Status é obrigatório" });
    }

    const atualizado = await service.atualizarStatusPedido(id, status);

    if (!atualizado) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    res.json(atualizado);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
}

export async function atualizarPedido(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const atualizado = await service.atualizarPedido(id, req.body);

    if (!atualizado) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    res.json(atualizado);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
}
