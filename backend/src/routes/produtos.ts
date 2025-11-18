import express from "express";
import {
  getProdutos,
  getProdutoById,
  postProduto,
  putProduto,
  deleteProduto,
} from "../controller/produtosController";

const router = express.Router();

router.get("/", getProdutos);
router.get("/:id", getProdutoById);
router.post("/", postProduto);
router.put("/:id", putProduto);
router.delete("/:id", deleteProduto);

export default router;
