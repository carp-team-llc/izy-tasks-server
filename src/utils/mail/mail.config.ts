import { Resend } from 'resend';

type SendMailParams = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: any;
}

const SendMail = async ({
  from,
  to,
  subject,
  text,
  html,
}: SendMailParams) => {
  const resend = new Resend(process.env.MAIL_API_KEY);
  const { data, error } = await resend.emails.send({
    from: from || "noreplay@calangthang.net",
    to: to,
    subject: subject,
    text: text,
    html: html
  })

  if (error) {
    console.error(error);
    return {
      statusCode: 400,
      message: "Failed to send email",
    }
  }

  return {
    statusCode: 200,
    message: "Email sent successfully",
    data
  }
}

export default SendMail;