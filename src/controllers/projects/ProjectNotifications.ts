import prisma from "../../utils/connection/connection";
import Helper from "../../utils/helper";
import IsMember from "../../utils/middleware/permission/IsMember";
import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo";

export interface ProjectInsight {
  projectId?: string;
}
export interface ProjectActivities {
  where: {};
  skip: number;
  take: number;
}
const ProjectNotifications = async (projectId: string, token: string) => {
  try {
    const userInfo = LoadUserInfo(token);

    const checkMember = IsMember(projectId, userInfo.userId);
    if (!checkMember) {
      return {
        statusCode: 403,
        message: "Forbidden: You are not a member of this project",
      };
    }

    const Notifications = await prisma.projectActivities.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      statusCode: 200,
      message: "Success!",
      data: Notifications,
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, message: "Error in project Notifications" };
  }
};

export default ProjectNotifications;
