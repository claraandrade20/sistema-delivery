import type { Request, Response } from "express";
export declare function getProdutos(req: Request, res: Response): void;
export declare function getProdutoById(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function postProduto(req: Request, res: Response): void;
export declare function putProduto(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
export declare function deleteProduto(req: Request, res: Response): Response<any, Record<string, any>> | undefined;
