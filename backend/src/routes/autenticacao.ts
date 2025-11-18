import express from "express";
import { register, login, getMe, getUsers } from "../controller/autenticacaoController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", getMe);
router.get("/users", getUsers);

export default router;
