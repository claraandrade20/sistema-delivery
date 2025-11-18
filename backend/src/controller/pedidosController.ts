import type { Request, Response } from "express";
import * as service from "../service/pedidosService";

export function getPedidos(req: Request, res: Response) {
  try {
    const { customerId, restaurantId } = req.query;

    let pedidos;
    if (customerId) {
      pedidos = service.listarPedidosPorCliente(customerId as string);
    } else if (restaurantId) {
      pedidos = service.listarPedidosPorRestaurante(restaurantId as string);
    } else {
      pedidos = service.listarPedidos();
    }

    res.json(pedidos);
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}

export function getPedidoById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const pedido = service.buscarPedido(id);

    if (!pedido) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    res.json(pedido);
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}

export function criarPedido(req: Request, res: Response) {
  try {
    const novo = service.adicionarPedido(req.body);
    res.status(201).json(novo);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
}

export function atualizarStatusPedido(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ erro: "Status é obrigatório" });
    }

    const atualizado = service.atualizarStatusPedido(id, status);

    if (!atualizado) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    res.json(atualizado);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
}

export function atualizarPedido(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const atualizado = service.atualizarPedido(id, req.body);

    if (!atualizado) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    res.json(atualizado);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
}
