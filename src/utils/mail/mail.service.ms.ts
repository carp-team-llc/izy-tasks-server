import nodemailer from "nodemailer";
import { MailConfig } from "../configs/mail.config";
import type { MailDTO } from "./mail.dto";
import { ConfidentialClientApplication } from "@azure/msal-node";

export const SendMail = async ({ to, subject, text, html }: MailDTO) => {
  const cca = new ConfidentialClientApplication(MailConfig);
  const getAccessToken = async () => {
    const result = await cca.acquireTokenByClientCredential({
      scopes: ["https://graph.microsoft.com/.default"],
    });
    return result.accessToken;
  };
  const sendEmail = async () => {
    const accessToken = await getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "Outlook365",
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USERNAME,
        accessToken: accessToken,
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
