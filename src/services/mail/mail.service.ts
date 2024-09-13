
import { Request, Response } from "express";
import { ForgotPasswordMail } from "../../controllers/mail/SendMail";

export class SendMailService {
  async SendForgotPassword (req: Request, res: Response) {
    try {
      const { email } = req.body;
      const sendResetPassword = await ForgotPasswordMail(email);
      res.status(sendResetPassword.statusCode).json({ message: sendResetPassword.message })
    } catch {
      res.status(500).json({
        message: "Internal Server Error!"
      })
    }
  }
}