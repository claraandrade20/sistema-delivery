import type { Request, Response, NextFunction } from "express";
export interface TokenPayload {
    id: string;
    email: string;
    role: string;
}
export declare function autenticar(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
export declare function autorizarRoles(...roles: string[]): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
