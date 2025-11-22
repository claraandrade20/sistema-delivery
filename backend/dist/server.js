"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const produtos_1 = __importDefault(require("./routes/produtos"));
const pedidos_1 = __importDefault(require("./routes/pedidos"));
const autenticacao_1 = __importDefault(require("./routes/autenticacao"));
const enderecos_1 = __importDefault(require("./routes/enderecos"));
const horarios_1 = __importDefault(require("./routes/horarios"));
// Carregar variáveis de ambiente do arquivo .env
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Log de requisições (desenvolvimento)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
// Rotas
app.use("/api/produtos", produtos_1.default);
app.use("/api/pedidos", pedidos_1.default);
app.use("/api/auth", autenticacao_1.default);
app.use("/api/enderecos", enderecos_1.default);
app.use("/api/horarios", horarios_1.default);
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
            horarios: "/api/horarios",
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
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ erro: "Erro interno do servidor" });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 API disponível em http://localhost:${PORT}`);
    console.log(`📝 Documentação: http://localhost:${PORT}/`);
});
//# sourceMappingURL=server.js.map