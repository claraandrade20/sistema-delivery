"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pedidosController_1 = require("../controller/pedidosController");
const router = express_1.default.Router();
router.get("/", pedidosController_1.getPedidos);
router.get("/:id", pedidosController_1.getPedidoById);
router.post("/", pedidosController_1.criarPedido);
router.patch("/:id/status", pedidosController_1.atualizarStatusPedido);
router.put("/:id", pedidosController_1.atualizarPedido);
exports.default = router;
//# sourceMappingURL=pedidos.js.map