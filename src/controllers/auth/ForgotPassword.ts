import prisma from "../../utils/connection/connection";

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
        email: email
      }
    })
    if (!user) {
      return {
        statusCode: 404,
        message: "User not found",
      }
    } else {
      return {
        statusCode: 200,
        message: "Password reset link sent to your email",
      }
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      message: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
