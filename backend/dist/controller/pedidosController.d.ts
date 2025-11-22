import type { Request, Response } from "express";
export declare function getPedidos(req: Request, res: Response): void;
export declare function getPedidoById(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function criarPedido(req: Request, res: Response): void;
export declare function atualizarStatusPedido(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function atualizarPedido(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
