
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

router.get("/authentication/verify_email", async(req, res) => { 
    await authService.VerifyEmail(req, res);
});

router.post("/authentication/resend_verify_email", async(req, res) => { 
    await authService.ResendVerificationEmail(req, res);
});

router.post("/authentication/forgot_password", async(req, res) => { 
    await authService.ForgotPassword(req, res);
});

router.post("/authentication/handle_infomation", async(req, res) => { 
    await authService.CheckResetPasswordRequest(req, res);
});

router.post("/authentication/new_password", async(req, res) => { 
    await authService.NewPassword(req, res);
});

export default router;