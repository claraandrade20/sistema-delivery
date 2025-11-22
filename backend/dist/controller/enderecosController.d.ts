import type { Request, Response } from "express";
export declare function getEnderecos(req: Request, res: Response): Promise<void>;
export declare function getEnderecoById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function postEndereco(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function putEndereco(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function deleteEndereco(req: Request, res: Response): Promise<void>;
