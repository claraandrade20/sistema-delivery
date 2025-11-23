import type { Request, Response } from "express";
import * as service from "../service/autenticacaoService";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ erro: "Dados incompletos" });
    }

    const usuario = await service.registrarUsuario({ name, email, password, phone, role });
    res.status(201).json(usuario);
  } catch (error: any) {
    res.status(400).json({ erro: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ erro: "Email e senha são obrigatórios" });
    }

    const resultado = await service.fazerLogin(email, password);
    res.json(resultado);
  } catch (error: any) {
    res.status(401).json({ erro: error.message });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    // O middleware de autenticação já deve ter colocado o userId no req
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ erro: "Não autenticado" });
    }

    const usuario = await service.buscarUsuarioPorId(userId);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const usuarios = await service.listarUsuarios();
    res.json(usuarios);
  } catch (error: any) {
    res.status(500).json({ erro: error.message });
  }
}
