
import express from 'express';
import { AuthService } from "../../services/auth/auth.service";
import VerifyAccount from '../../controllers/auth/VerifyAccount';

const router = express.Router();
const authService = new AuthService();

router.post("/login", async (req, res) => {
    await authService.userLogin(req, res);
});

router.post("/register", async (req, res) => {
    await authService.userRegister(req, res);
});

router.post("/users_panigation", async(req, res) => {
    await authService.userListPanigation(req, res);
});

router.get("/authentication/verify_email", async(req, res) => { 
    await authService.VerifyEmail(req, res);
});

export default router;