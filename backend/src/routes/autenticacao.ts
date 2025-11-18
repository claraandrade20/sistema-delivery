import express from "express";
import { register, login, getMe, getUsers } from "../controller/autenticacaoController";

const router = express.Router();

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

router.post("/register", register);
router.post("/login", login);
router.get("/me", getMe);
router.get("/users", getUsers);

export default router;
