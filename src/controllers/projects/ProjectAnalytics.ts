import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo"
import prisma from "../../utils/connection/connection"

const Activate = async (token: string) => {
  try {
    if (!token) {
      return {
        statusCode: 401,
        message: "Unauthorized",
      }
    };
    const userInfo = LoadUserInfo(token)
      const loadActivate = await prisma.projectActivities.findMany({
        where: {
          AND: [
            {
              actionById: userInfo?.userId,
            },
            {
              actionCode: "CHANGE_STATUS",
            }
          ]
        },
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
      });
      return {
        statusCode: 200,
        message: "Project activated successfully",
        data: loadActivate,
      }
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error activating project",
    }
  }
}

export { Activate }