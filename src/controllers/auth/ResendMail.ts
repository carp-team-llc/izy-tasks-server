import crypto from "crypto";
import prisma from "../../utils/connection/connection";
import { SendMailSystem } from "../mail/SendMail";
import { ActivateAccountEmailForm } from "../../constant/MailForm";

const ResendVerificationEmail = async (email?: string, password?: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (user.isVerify) {
      return {
        statusCode: 400,
        message: "Your account has already been verified. Please log in.",
      };
    }
    const newVerificationToken = crypto.randomBytes(32).toString("hex");
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { verificationToken: newVerificationToken },
    });
    const verificationLink = `${process.env.IP_HOST_SSL}/api/v1/auth/authentication/verify_email?token=${newVerificationToken}`;
    const sendActivateMail = await SendMailSystem({
      to: email,
      subject: "Activate your account!",
      text: "Hi, we are Carp Team!",
      content: verificationLink,
      html: ActivateAccountEmailForm(email, verificationLink),
    });
    return {
      statusCode: sendActivateMail.statusCode,
      message: "We just resent you an email to verify your account, please check your email to verify your account!",
      notification:
        "We just resent you an email to verify your account, please check your email to verify your account!",
      data: {
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    };
  } catch (error) {
    console.error("Error in resendVerificationEmail:", error);
    return {
      statusCode: 500,
      message: "Error when resending verification email",
    };
  }
};

export { ResendVerificationEmail };