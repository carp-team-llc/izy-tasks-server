import nodemailer from "nodemailer";
import type { MailDTO } from "./mail.dto";
import { OAuth2Client } from 'google-auth-library'

export const SendMail = async ({ to, subject, text, html }: MailDTO) => {

  const GetAccessToken = () => {
    const myOAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID_SERVICE,
      process.env.CLIENT_SECRET_SERVICE
    )
    myOAuth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN
    })
    return myOAuth2Client.getAccessToken()
  }

  const sendEmail = async () => {
    const accessToken = await GetAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USER,
        clientId: process.env.CLIENT_ID_SERVICE,
        clientSecret: process.env.CLIENT_SECRET_SERVICE,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return reject(error);
        }
        console.log("Email sent: " + info.response);
        resolve(info);
      });
    });
  };
  return await sendEmail().catch(console.error);
};

export default SendMail;
