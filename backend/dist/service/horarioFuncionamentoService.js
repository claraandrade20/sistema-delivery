"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buscarHorariosRestaurante = buscarHorariosRestaurante;
exports.atualizarHorariosFuncionamento = atualizarHorariosFuncionamento;
exports.converterParaBusinessHours = converterParaBusinessHours;
exports.buscarHorariosFormatados = buscarHorariosFormatados;
const database_1 = __importDefault(require("../config/database"));
/**
 * Busca todos os horários de funcionamento de um restaurante
 */
async function buscarHorariosRestaurante(restaurantId) {
    try {
        const connection = await database_1.default.getConnection();
        const [rows] = await connection.query(`SELECT * FROM horario_funcionamento 
       WHERE id_restaurante = ? 
       ORDER BY dia_semana ASC`, [restaurantId]);
        connection.release();
        return rows;
    }
    catch (error) {
        console.error("Erro ao buscar horários:", error);
        throw error;
    }
}
/**
 * Atualiza os horários de funcionamento de um restaurante
 */
async function atualizarHorariosFuncionamento(restaurantId, horarios) {
    try {
        const connection = await database_1.default.getConnection();
        // Para cada horário, atualizar no banco
        for (const horario of horarios) {
            const dataFechado = horario.isOpen ? null : new Date().toISOString();
            await connection.query(`UPDATE horario_funcionamento 
         SET hora_inicio = ?, 
             hora_fim = ?, 
             fechado_em = ?,
             atualizado_em = NOW()
         WHERE id_restaurante = ? AND dia_semana = ?`, [
                horario.isOpen ? horario.openTime : null,
                horario.isOpen ? horario.closeTime : null,
                dataFechado,
                restaurantId,
                horario.dayOfWeek,
            ]);
        }
        connection.release();
        // Retornar os horários atualizados
        return await buscarHorariosRestaurante(restaurantId);
    }
    catch (error) {
        console.error("Erro ao atualizar horários:", error);
        throw error;
    }
}
/**
 * Converte dados do banco para formato da API
 */
function converterParaBusinessHours(horarios) {
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
async function buscarHorariosFormatados(restaurantId) {
    const horarios = await buscarHorariosRestaurante(restaurantId);
    return converterParaBusinessHours(horarios);
}
//# sourceMappingURL=horarioFuncionamentoService.js.map