import { GeneratePasswordResetEmail } from "../../constant/MailForm";
import type { MailDTO } from "../../utils/mail/mail.dto";
import { SendMail } from "../../utils/mail/mail.service";

const SendMailSystem = async ({
  to,
  subject,
  text,
  html,
  content,
  generateHtml
}: MailDTO & { generateHtml?: (to: string, content: string) => string }) => {
  try {
    if (!to || !subject || !text) {
      return {
        statusCode: 400,
        message: "Thiếu thông tin gửi mail!",
      };
    }

    const htmlContent = generateHtml
      ? generateHtml(to, content)
      : html;

    const sendMail = await SendMail({
      to,
      subject,
      text,
      html: htmlContent,
    });
    return {
      statusCode: 201,
      message: `Send mail to ${to} success!`,
    };
    
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      message: "Error when send mail!",
    };
  }
};

const ForgotPasswordMail = async (email: string) => {
  try {
    const sendMail = await SendMailSystem({
      to: email,
      subject: "Reset your password!",
      text: "Hi, we are Carp Team!",
      content:
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUXbmV2ZXIgZ29ubmEgZ2l2ZSB5b3UgdXA%3D",
    });
    if (sendMail) {
      return {
        statusCode: sendMail.statusCode,
        message: sendMail.message,
      };
    } else {
      return {
        statusCode: 500,
        message: "Error when send mail!",
      };
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      message: "Error when send mail!",
    };
  }
};

export { SendMailSystem, ForgotPasswordMail };
