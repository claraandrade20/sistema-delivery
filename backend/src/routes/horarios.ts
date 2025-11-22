import express from "express";
import {
  getHorarios,
  getHorariosGeral,
  updateHorarios,
} from "../controller/horarioFuncionamentoController";

const router = express.Router();

// GET /horarios?restaurantId=1
router.get("/", getHorariosGeral);

// GET /horarios/:restaurantId
router.get("/:restaurantId", getHorarios);

// PUT /horarios/:restaurantId
router.put("/:restaurantId", updateHorarios);

export default router;
