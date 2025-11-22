import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import produtosRoutes from "./routes/produtos";
import pedidosRoutes from "./routes/pedidos";
import autenticacaoRoutes from "./routes/autenticacao";
import enderecosRoutes from "./routes/enderecos";
import pool from "./config/database";

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Log de requisições (desenvolvimento)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rotas
app.use("/api/produtos", produtosRoutes);
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/auth", autenticacaoRoutes);
app.use("/api/enderecos", enderecosRoutes);

// Rota raiz da API
app.get("/api", (req, res) => {
  res.json({
    message: "API Delivery funcionando!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      produtos: "/api/produtos",
      pedidos: "/api/pedidos",
      enderecos: "/api/enderecos",
      health: "/api/health",
    },
  });
});

// Rota de teste
app.get("/", (req, res) => {
  res.json({
    message: "API Delivery funcionando!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      produtos: "/api/produtos",
      pedidos: "/api/pedidos",
    },
  });
});

// Rota de healthcheck
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Tratamento de erro 404
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

// Tratamento de erros global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ erro: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}`);
  console.log(`📝 Documentação: http://localhost:${PORT}/`);
});
