"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const produtosController_1 = require("../controller/produtosController");
const router = express_1.default.Router();
router.get("/", produtosController_1.getProdutos);
router.get("/:id", produtosController_1.getProdutoById);
router.post("/", produtosController_1.postProduto);
router.put("/:id", produtosController_1.putProduto);
router.delete("/:id", produtosController_1.deleteProduto);
exports.default = router;
//# sourceMappingURL=produtos.js.map