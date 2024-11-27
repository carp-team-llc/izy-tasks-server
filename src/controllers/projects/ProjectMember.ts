import prisma from "../../utils/connection/connection";
import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo";

const ShowMebesList = async (projectId: string, token: string) => {
  try {
    const errors: string[] = [];
    if (!projectId) errors.push("projectId");
    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
      };
    }
    if (!token) {
      return {
        statusCode: 401,
        message: "Unauthorized",
      };
    }

    const userInfo = LoadUserInfo(token);

    const isMember = await prisma.projectMember.findFirst({
      where: {
        AND: [
          { projectId },
          { userId: userInfo.userId },
        ],
      },
    });

    if (!isMember) {
      return {
        statusCode: 403,
        message: "Forbidden: You are not a member of this project",
      };
    }
    const members = await prisma.projectMember.findMany({
      where: {
        projectId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
            createdAt: true,
            profile: true,
          },
        },
      },
    });
    return {
      statusCode: 200,
      message: "Members list fetched successfully",
      data: members,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error fetching members list",
    };
  }
};

export { ShowMebesList };