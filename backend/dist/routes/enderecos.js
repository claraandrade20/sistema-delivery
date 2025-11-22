"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enderecosController_1 = require("../controller/enderecosController");
const router = express_1.default.Router();
router.get("/", enderecosController_1.getEnderecos);
router.get("/:id", enderecosController_1.getEnderecoById);
router.post("/", enderecosController_1.postEndereco);
router.put("/:id", enderecosController_1.putEndereco);
router.delete("/:id", enderecosController_1.deleteEndereco);
exports.default = router;
//# sourceMappingURL=enderecos.js.map