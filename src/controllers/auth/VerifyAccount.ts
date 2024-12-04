
import prisma from "../../utils/connection/connection";

const VerifyAccount = async (token: string) => {
  try {
    if (!token) {
      return {
        statusCode: 404,
        message: "Error verify url!",
        data: [],
      };
    }
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: String(token),
      },
    });
    if (!user) {
      return {
        statusCode: 404,
        message: "Error verify url!",
        data: [],
      };
    }
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        verificationToken: null,
        isVerify: true,
      },
    });
    return {
      statusCode: 201,
      message: "Account verified successfully!",
      data: user.username,
    }
  } catch (err) {
    console.error("err: ", err);
    return {
      statusCode: 500,
      message: "Internal Server Error!",
      data: {},
    };
  }
};

export default VerifyAccount;
