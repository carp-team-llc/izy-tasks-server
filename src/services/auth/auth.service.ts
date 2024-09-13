
import { Request, Response } from 'express';
import userLogin from '../../controllers/auth/Login';
import { UserLogin, UserAuth, UserPagination } from '../../controllers/auth/dto/authInfo.dto';
import userRegister from '../../controllers/auth/Register';
import usersPanigaiton from '../../controllers/auth/UsersPanigation';
import { SendMail } from '../../utils/mail/mail.service';

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

    async testMailService(req: Request, res: Response) {
        try {
            const { to, subject, text } = req.body;
            if (!to || !subject || !text) {
                return res.status(400).json({ message: 'Thiếu thông tin gửi mail' });
            }
            const sendMail = await SendMail({
                to,
                subject,
                text
            })
            return res.status(201).json({
                message: `Send mail to ${to} success!`
            })
        } catch {
            return res.status(500).json({message: "Internal Server Error!"})
        }
    }

}