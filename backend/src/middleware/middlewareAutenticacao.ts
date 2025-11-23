import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key-default-dev-only";

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  console.log(`[AUTH] Rota: ${req.method} ${req.path}`);
  console.log(`[AUTH] Authorization header: ${authHeader ? 'presente' : 'ausente'}`);

  if (!authHeader) {
    console.log('[AUTH] Token não fornecido');
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    console.log('[AUTH] Formato de token inválido');
    return res.status(401).json({ erro: "Formato de token inválido" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    console.log('[AUTH] Token mal formatado');
    return res.status(401).json({ erro: "Token mal formatado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    (req as any).userId = decoded.id;
    (req as any).userEmail = decoded.email;
    (req as any).userRole = decoded.role;
    console.log(`[AUTH] Token válido - User: ${decoded.email}, Role: ${decoded.role}`);
    return next();
  } catch (error) {
    console.log('[AUTH] Token inválido:', error);
    return res.status(401).json({ erro: "Token inválido" });
  }
}

export function autorizarRoles(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).userRole;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    next();
  };
}
