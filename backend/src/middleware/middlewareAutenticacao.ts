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

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ erro: "Formato de token inválido" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ erro: "Token mal formatado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    (req as any).userId = decoded.id;
    (req as any).userEmail = decoded.email;
    (req as any).userRole = decoded.role;
    return next();
  } catch (error) {
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
