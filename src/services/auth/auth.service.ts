
import { Request, Response } from 'express';
import { UserAuth, UserLogin, UserPagination } from '../../controllers/auth/dto/authInfo.dto';
import userLogin from '../../controllers/auth/Login';
import userRegister from '../../controllers/auth/Register';
import usersPanigaiton from '../../controllers/auth/UsersPanigation';
import VerifyAccount from '../../controllers/auth/VerifyAccount';
import { WelcomeNewUser } from '../../constant/MailForm';
import { ResendVerificationEmail } from '../../controllers/auth/ResendMail';

export class AuthService{

    async userLogin(req: Request, res: Response) {
        try {
            const {email, password}: UserLogin = req.body;
            const login = await userLogin({ email, password });
            return res.status(login.statusCode).json(login);
        } catch (error) {
            console.error('Error in userLogin:', error);
            return res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
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

    async userListPanigation(req: Request, res: Response) {
        try {
            const {where, take = 0, skip = 10}: UserPagination = req.body;
            const usersList = await usersPanigaiton({
                where,
                take,
                skip
            });
            return res.status(usersList.statusCode).json(usersList.data)
        } catch (err) {
            return res.status(500).json({message: "Internal Server Error!"})
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
}