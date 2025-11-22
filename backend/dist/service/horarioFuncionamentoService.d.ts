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
export declare function buscarHorariosRestaurante(restaurantId: number): Promise<HorarioFuncionamento[]>;
/**
 * Atualiza os horários de funcionamento de um restaurante
 */
export declare function atualizarHorariosFuncionamento(restaurantId: number, horarios: BusinessHourPayload[]): Promise<HorarioFuncionamento[]>;
/**
 * Converte dados do banco para formato da API
 */
export declare function converterParaBusinessHours(horarios: HorarioFuncionamento[]): BusinessHourPayload[];
/**
 * Busca horários em formato de API
 */
export declare function buscarHorariosFormatados(restaurantId: number): Promise<BusinessHourPayload[]>;
