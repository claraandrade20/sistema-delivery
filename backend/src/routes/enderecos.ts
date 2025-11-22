import express from "express";
import {
  getEnderecos,
  getEnderecoById,
  postEndereco,
  putEndereco,
  deleteEndereco,
} from "../controller/enderecosController";

const router = express.Router();

router.get("/", getEnderecos);
router.get("/:id", getEnderecoById);
router.post("/", postEndereco);
router.put("/:id", putEndereco);
router.delete("/:id", deleteEndereco);

export default router;
