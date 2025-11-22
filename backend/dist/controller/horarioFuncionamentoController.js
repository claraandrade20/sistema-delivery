"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHorarios = getHorarios;
exports.getHorariosGeral = getHorariosGeral;
exports.updateHorarios = updateHorarios;
const service = __importStar(require("../service/horarioFuncionamentoService"));
/**
 * GET /horarios/:restaurantId
 * Busca os horários de funcionamento de um restaurante
 */
async function getHorarios(req, res) {
    try {
        const { restaurantId } = req.params;
        const id = parseInt(restaurantId, 10);
        if (isNaN(id)) {
            return res.status(400).json({ erro: "ID do restaurante inválido" });
        }
        const horarios = await service.buscarHorariosFormatados(id);
        if (horarios.length === 0) {
            return res.status(404).json({ erro: "Restaurante não encontrado" });
        }
        res.json(horarios);
    }
    catch (error) {
        res.status(500).json({ erro: error.message });
    }
}
/**
 * GET /horarios
 * Busca todos os horários (com query param restaurantId)
 */
async function getHorariosGeral(req, res) {
    try {
        const { restaurantId } = req.query;
        if (!restaurantId) {
            return res.status(400).json({ erro: "restaurantId é obrigatório" });
        }
        const id = parseInt(restaurantId, 10);
        if (isNaN(id)) {
            return res.status(400).json({ erro: "ID do restaurante inválido" });
        }
        const horarios = await service.buscarHorariosFormatados(id);
        if (horarios.length === 0) {
            return res.status(404).json({ erro: "Restaurante não encontrado" });
        }
        res.json(horarios);
    }
    catch (error) {
        res.status(500).json({ erro: error.message });
    }
}
/**
 * PUT /horarios/:restaurantId
 * Atualiza os horários de funcionamento de um restaurante
 */
async function updateHorarios(req, res) {
    try {
        const { restaurantId } = req.params;
        const horarios = req.body;
        const id = parseInt(restaurantId, 10);
        if (isNaN(id)) {
            return res.status(400).json({ erro: "ID do restaurante inválido" });
        }
        if (!Array.isArray(horarios)) {
            return res.status(400).json({ erro: "Horários deve ser um array" });
        }
        const horariosAtualizados = await service.atualizarHorariosFuncionamento(id, horarios);
        res.json(horariosAtualizados);
    }
    catch (error) {
        res.status(500).json({ erro: error.message });
    }
}
//# sourceMappingURL=horarioFuncionamentoController.js.map