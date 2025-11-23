import express from "express";
import { register, login, getMe, getUsers, resetPassword } from "../controller/autenticacaoController";
import { autenticar } from "../middleware/middlewareAutenticacao";

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
      resetPassword: "POST /api/auth/reset-password",
    },
  });
});

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.get("/me", autenticar, getMe);
router.get("/users", getUsers);

export default router;
