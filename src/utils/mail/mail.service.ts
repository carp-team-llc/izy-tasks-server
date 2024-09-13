
import nodemailer from 'nodemailer';
import { MailConfig } from '../configs/mail.config';
import type { MailDTO } from './mail.dto';

export const SendMail = async ({
  to,
  subject,
  text
}: MailDTO) => {
  const transporter = nodemailer.createTransport({
    host: MailConfig.host,
    port: 587, 
    secure: false,
    auth: {
        user: MailConfig.auth.user,
        pass: MailConfig.auth.password
    },
    tls: {
        ciphers: 'SSLv3'
    }
  });

  const mailOptions = {
    from: MailConfig.auth.user,
    to,
    subject,
    text,
  }

  const info = await transporter.sendMail(mailOptions);
    return info;
}