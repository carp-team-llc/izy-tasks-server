
import { Request, Response } from 'express';
import { UserAuth, UserLogin, UserPagination } from '../../controllers/auth/dto/authInfo.dto';
import userLogin from '../../controllers/auth/Login';
import userRegister from '../../controllers/auth/Register';
import VerifyAccount from '../../controllers/auth/VerifyAccount';
import { WelcomeNewUser } from '../../constant/MailForm';
import { ResendVerificationEmail } from '../../controllers/auth/ResendMail';
import { ChangePassword, ForgotPassword, HandleRessetPasswordRequest } from '../../controllers/auth/ForgotPassword';
import { AuthGuard } from '../../utils/middleware/authentication/AuthGuard';

export class AuthService{

    async me (req: Request, res: Response) {
        const token  = AuthGuard(req);
        if (!token) {
            res.status(401).json({ statusCode: 401, message: "Unauthorized", isLogin: false });
        }
        res.status(200).json({
            message: "User information",
            isLogin: true,
        })
    }

    async userLogin(req: Request, res: Response) {
        try {
            const {email, password}: UserLogin = req.body;
            const login = await userLogin({ email, password });
            const token = login.accessToken;
            res.cookie('token', token, {
                httpOnly: true, // để ngăn trình duyệt truy cập cookie
                secure: process.env.NODE_ENV === 'production', // chỉ truy cập qua HTTPS trong môi trường production
                sameSite: 'lax', // ngăn trình duyệt truy cập cookie từ nguồn khác nhưng vẫn cho phép truy cập từ cùng một nguồn
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
            })
            return res.status(login.statusCode).json(login);
        } catch (error) {
            console.error('Error in userLogin:', error);
            return res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
        }
    }

    async userLogout(req: Request, res: Response) {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production'
            });
            return res.status(200).json({ statusCode: 200, message: "Logout successfully!" });
        } catch (err) {
            return res.status(500).json({ statusCode: 500, message: "Internal Server Error" })
        }
    }

    async userRegister(req: Request, res: Response) {
        try {
            const { username, email, password, phone }: UserAuth = req.body;
            const register = await userRegister({ 
                username, 
                email, 
                password, 
                phone,
                role: 'member',
                isAdmin: false,
            });
            return res.status(register.statusCode).json({
                message: register.message,
                data: register.data
            });
        } catch (error) {
            console.error('Error in userLogin:', error);
            return res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
        }
    }

    async VerifyEmail(req: Request, res: Response) {
        const { token } = req.query;
        const verifyEmail = await VerifyAccount(String(token))
        if (verifyEmail.statusCode === 201) {
            res.status(201).send(WelcomeNewUser(verifyEmail.data.toString()));
        } else if (verifyEmail.statusCode === 409) {
            res.status(409).json({ error: verifyEmail.message })
        } else {
            res.status(verifyEmail.statusCode).json({
                message: verifyEmail.message,
                data: verifyEmail.data,
            });
        }
    }

    async ResendVerificationEmail(req: Request, res: Response) {
        const { email } = req.body;
        const resendEmail = await ResendVerificationEmail(email);
        return res.status(resendEmail.statusCode).json({
            message: resendEmail.message,
            data: resendEmail.data,
        });
    }

    async ForgotPassword(req: Request, res: Response) {
        const { email } = req.body;
        const result = await ForgotPassword(email);
        return res.status(result.statusCode).json({
            message: result.message,
        });
    }

    async CheckResetPasswordRequest(req: Request, res: Response) {
        try {
            const { email, token, resetPasswordCreatedAt, resetPasswordExpires } = req.body;
            const result = await HandleRessetPasswordRequest(email, token, resetPasswordCreatedAt, resetPasswordExpires);
            return res.status(result.statusCode).json({
                message: result.message,
            });
        } catch (err) {
            return res.status(400).json("Bad request!")
        }
    }

    async NewPassword(req: Request, res: Response) {
        const { email, token, newPassword } = req.body;
        const result = await ChangePassword(email, token, newPassword);
        return res.status(result.statusCode).json({
            messge: result.message,
        })
    }

}