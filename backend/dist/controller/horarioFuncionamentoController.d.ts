import type { Request, Response } from "express";
/**
 * GET /horarios/:restaurantId
 * Busca os horários de funcionamento de um restaurante
 */
export declare function getHorarios(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * GET /horarios
 * Busca todos os horários (com query param restaurantId)
 */
export declare function getHorariosGeral(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**
 * PUT /horarios/:restaurantId
 * Atualiza os horários de funcionamento de um restaurante
 */
export declare function updateHorarios(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
