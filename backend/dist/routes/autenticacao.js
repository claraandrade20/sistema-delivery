"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const autenticacaoController_1 = require("../controller/autenticacaoController");
const router = express_1.default.Router();
// Rota raiz da autenticação
router.get("/", (req, res) => {
    res.json({
        message: "Endpoints de Autenticação",
        endpoints: {
            login: "POST /api/auth/login",
            register: "POST /api/auth/register",
            me: "GET /api/auth/me",
            users: "GET /api/auth/users",
        },
    });
});
router.post("/register", autenticacaoController_1.register);
router.post("/login", autenticacaoController_1.login);
router.get("/me", autenticacaoController_1.getMe);
router.get("/users", autenticacaoController_1.getUsers);
exports.default = router;
//# sourceMappingURL=autenticacao.js.map