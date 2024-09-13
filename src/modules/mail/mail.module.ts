
import express from 'express';
import { SendMailService } from '../../services/mail/mail.service';

const router = express.Router();
const sendMailService = new SendMailService;

router.post("/reset_password", async (req, res) => {
  await sendMailService.SendForgotPassword(req, res);
})

export default router;