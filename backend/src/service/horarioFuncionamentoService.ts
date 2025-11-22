import pool from "../config/database";

export interface HorarioFuncionamento {
  id: number;
  id_restaurante: number;
  dia_semana: number;
  nome_dia: string;
  hora_inicio: string;
  hora_fim: string;
  fechado_em: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface BusinessHourPayload {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

/**
 * Busca todos os horários de funcionamento de um restaurante
 */
export async function buscarHorariosRestaurante(
  restaurantId: number
): Promise<HorarioFuncionamento[]> {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT * FROM horario_funcionamento 
       WHERE id_restaurante = ? 
       ORDER BY dia_semana ASC`,
      [restaurantId]
    );
    connection.release();
    return rows as HorarioFuncionamento[];
  } catch (error) {
    console.error("Erro ao buscar horários:", error);
    throw error;
  }
}

/**
 * Atualiza os horários de funcionamento de um restaurante
 */
export async function atualizarHorariosFuncionamento(
  restaurantId: number,
  horarios: BusinessHourPayload[]
): Promise<HorarioFuncionamento[]> {
  try {
    const connection = await pool.getConnection();

    // Para cada horário, atualizar no banco
    for (const horario of horarios) {
      const dataFechado = horario.isOpen ? null : new Date().toISOString();

      await connection.query(
        `UPDATE horario_funcionamento 
         SET hora_inicio = ?, 
             hora_fim = ?, 
             fechado_em = ?,
             atualizado_em = NOW()
         WHERE id_restaurante = ? AND dia_semana = ?`,
        [
          horario.isOpen ? horario.openTime : null,
          horario.isOpen ? horario.closeTime : null,
          dataFechado,
          restaurantId,
          horario.dayOfWeek,
        ]
      );
    }

    connection.release();

    // Retornar os horários atualizados
    return await buscarHorariosRestaurante(restaurantId);
  } catch (error) {
    console.error("Erro ao atualizar horários:", error);
    throw error;
  }
}

/**
 * Converte dados do banco para formato da API
 */
export function converterParaBusinessHours(
  horarios: HorarioFuncionamento[]
): BusinessHourPayload[] {
  return horarios.map((h) => ({
    dayOfWeek: h.dia_semana,
    isOpen: h.fechado_em === null && h.hora_inicio !== null,
    openTime: h.hora_inicio || "00:00",
    closeTime: h.hora_fim || "00:00",
  }));
}

/**
 * Busca horários em formato de API
 */
export async function buscarHorariosFormatados(
  restaurantId: number
): Promise<BusinessHourPayload[]> {
  const horarios = await buscarHorariosRestaurante(restaurantId);
  return converterParaBusinessHours(horarios);
}
