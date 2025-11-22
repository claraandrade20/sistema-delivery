import type { Request, Response } from "express";
import * as service from "../service/horarioFuncionamentoService";

/**
 * GET /horarios/:restaurantId
 * Busca os horários de funcionamento de um restaurante
 */
export async function getHorarios(req: Request, res: Response) {
  try {
    const { restaurantId } = req.params;
    const id = parseInt(restaurantId, 10);

    if (isNaN(id)) {
      return res.status(400).json({ erro: "ID do restaurante inválido" });
    }

    const horarios = await service.buscarHorariosFormatados(id);

    if (horarios.length === 0) {
      return res.status(404).json({ erro: "Restaurante não encontrado" });
    }

    res.json(horarios);
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}

/**
 * GET /horarios
 * Busca todos os horários (com query param restaurantId)
 */
export async function getHorariosGeral(req: Request, res: Response) {
  try {
    const { restaurantId } = req.query;

    if (!restaurantId) {
      return res.status(400).json({ erro: "restaurantId é obrigatório" });
    }

    const id = parseInt(restaurantId as string, 10);

    if (isNaN(id)) {
      return res.status(400).json({ erro: "ID do restaurante inválido" });
    }

    const horarios = await service.buscarHorariosFormatados(id);

    if (horarios.length === 0) {
      return res.status(404).json({ erro: "Restaurante não encontrado" });
    }

    res.json(horarios);
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}

/**
 * PUT /horarios/:restaurantId
 * Atualiza os horários de funcionamento de um restaurante
 */
export async function updateHorarios(req: Request, res: Response) {
  try {
    const { restaurantId } = req.params;
    const horarios = req.body;

    const id = parseInt(restaurantId, 10);

    if (isNaN(id)) {
      return res.status(400).json({ erro: "ID do restaurante inválido" });
    }

    if (!Array.isArray(horarios)) {
      return res.status(400).json({ erro: "Horários deve ser um array" });
    }

    const horariosAtualizados = await service.atualizarHorariosFuncionamento(
      id,
      horarios
    );

    res.json(horariosAtualizados);
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}
