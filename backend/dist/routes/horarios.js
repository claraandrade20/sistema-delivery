"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const horarioFuncionamentoController_1 = require("../controller/horarioFuncionamentoController");
const router = express_1.default.Router();
// GET /horarios?restaurantId=1
router.get("/", horarioFuncionamentoController_1.getHorariosGeral);
// GET /horarios/:restaurantId
router.get("/:restaurantId", horarioFuncionamentoController_1.getHorarios);
// PUT /horarios/:restaurantId
router.put("/:restaurantId", horarioFuncionamentoController_1.updateHorarios);
exports.default = router;
//# sourceMappingURL=horarios.js.map