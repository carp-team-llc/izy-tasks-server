
import express from 'express';
import { AuthService } from "../../services/auth/auth.service";

const router = express.Router();
const authService = new AuthService();

router.post("/login", async (req, res) => {
    await authService.userLogin(req, res);
});

router.post("/register", async (req, res) => {
    await authService.userRegister(req, res);
});

export default router;