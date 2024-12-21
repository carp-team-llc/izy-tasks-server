import prisma from "../../utils/connection/connection";
import crypto from "crypto";
import { SendMailSystem } from "../mail/SendMail";
import { ResetPasswordForm } from "../../constant/MailForm";
import bcrypt from 'bcrypt';

const ForgotPassword = async (email: string) => {
  try {
    if (!email) {
      return {
        statusCode: 400,
        message:
          "Information is not complete, please enter complete information before trying again!",
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      return {
        statusCode: 404,
        message: "User not found",
      };
    }
    const resetPassToken = crypto.randomBytes(32).toString("hex");
    const resetRequestTime = new Date();

    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + 15);
    const resetExpires = currentTime.toISOString();
    await prisma.user.update({
      where: { email: email },
      data: {
        resetPasswordToken: resetPassToken,
        resetPasswordCreatedAt: resetRequestTime,
        resetPasswordExpires: resetExpires,
      },
    });
    const resetPasswordLink = `${
      process.env.IP_HOST_SSL
    }/reset-password?token=${resetPassToken}&email=${email}&createdAt=${encodeURIComponent(
      resetRequestTime.toISOString()
    )}&expiresAt=${encodeURIComponent(resetExpires)}`;
    const sendActivateMail = await SendMailSystem({
      to: email,
      subject: "Activate your account!",
      text: "Hi, we are Carp Team!",
      content: resetPasswordLink,
      html: ResetPasswordForm(email, resetPasswordLink),
    });
    return {
      statusCode: sendActivateMail.statusCode,
      message:
        "We just resent you an email to reset your password, please check your email to reset your password!",
      notification:
        "We just resent you an email to vreset your password, please check your email to reset your password!",
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      message: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

const HandleResetPasswordRequest = async (
  email: string,
  token: string,
  resetPasswordCreatedAt: string,
  resetPasswordExpires: string,
) => {
  try {
    const errors: string[] = [];
    if (!email) errors.push("email");
    if (!token) errors.push("token");
    if (!resetPasswordCreatedAt) errors.push("resetPasswordCreatedAt");
    if (!resetPasswordExpires) errors.push("resetPasswordExpires");

    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
        data: [
          {
            status: "error",
            note: "????????????????????????",
          },
        ],
      };
    }
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        statusCode: 401,
        message: "Invalid email!",
      };
    }

    const invalid: string[] = [];
    if (token !== user.resetPasswordToken) invalid.push("token");
    if (
      new Date(resetPasswordCreatedAt).getTime() !==
      user.resetPasswordCreatedAt.getTime()
    ) {
      invalid.push("createdAt");
    }
    if (
      new Date(resetPasswordExpires).getTime() !==
      user.resetPasswordExpires.getTime()
    ) {
      invalid.push("expiresAt");
    }

    if (invalid.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are invalid: ${invalid.join(", ")}`,
        data: [
          {
            status: "error",
            note: "????????????????????????",
          },
        ],
      };
    }

    const currentTime = new Date();
    const expiresAt = new Date(resetPasswordExpires);

    if (currentTime > expiresAt) {
      return {
        statusCode: 400,
        message: "Url has expired! Please try again.",
      };
    }

    return {
      statusCode: 201,
      message: "Valid infomation."
    }

  } catch (error) {
    return {
      statusCode: 500,
      message: "Internal Server Error!"
    }
  }
};

const ChangePassword = async (
  email: string,
  token: string,
  newPassword: string,
) => {
  try {
    const errors: string[] = [];
    if (!email) errors.push("Email");
    if (!newPassword) errors.push("Password");

    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
        data: [
          {
            status: "error",
            note: "????????????????????????",
          },
        ],
      };
    }

    const findUser = await prisma.user.findFirst({
      where: { email }
    })

    if (!findUser) {
      return {
        statusCode: 400,
        message: "Invalid user!"
      }
    }

    if (token !== findUser.resetPasswordToken) {
      return {
        statusCode: 400,
        message: "Invalid infomation!"
      }
    }

    const changedPassword = await bcrypt.hash(newPassword, 10);

    const changePasword = await prisma.user.update({
      where: { email },
      data: {
        password: changedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        resetPasswordCreatedAt: null,
      }
    })

    if (!changePasword) {
      return {
        statusCode: 400,
        message: "Error when change password!"
      }
    }

    return {
      statusCode: 201,
      message: "Changed password!"
    }

  } catch (err) {
    console.error("Error in change password: ", err);
    return {
      statusCode: 500,
      message: "Internal Server Error!"
    }
  }
}

export { ForgotPassword, HandleResetPasswordRequest as HandleRessetPasswordRequest, ChangePassword };
