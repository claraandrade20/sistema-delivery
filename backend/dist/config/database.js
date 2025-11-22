"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "sistema_delivery",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
pool
    .getConnection()
    .then((connection) => {
    console.log("Conectado ao banco de dados MySQL com sucesso!");
    connection.release();
})
    .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
});
exports.default = pool;
//# sourceMappingURL=database.js.map