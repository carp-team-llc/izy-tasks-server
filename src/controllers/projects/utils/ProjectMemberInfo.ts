import prisma from "../../../utils/connection/connection";
import { LoadUserInfo } from "../../../utils/middleware/permission/LoadUserInfo";

export class ProjectMemberInfo {
  async IsProjectMember(projectId: string, token?: string, userId?: string) {
    let targetUserId = userId;
  
    if (!targetUserId && token) {
      const userInfo = LoadUserInfo(token);
      targetUserId = userInfo.userId;
    }
  
    if (!targetUserId) {
      return {
        statusCode: 400,
        message: "Missing userId",
        isMember: false,
      };
    }
  
    const isMember = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: targetUserId,
      },
    });
  
    if (!isMember) {
      return {
        statusCode: 403,
        message: "Forbidden: User is not a member of this project",
        isMember: false,
      };
    }
  
    return {
      statusCode: 200,
      message: "Success",
      isMember: true,
    };
  }

  async ProjectMemberRole(projectId: string, token: string) {
    const userInfo = LoadUserInfo(token);
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        AND: [{ projectId }, { userId: userInfo.userId }],
      },
    });
    if (!projectMember) {
      return {
        statusCode: 403,
        message: "Forbidden: You are not a member of this project",
        role: null,
      };
    }

    return {
      statusCode: 200,
      message: "Success",
      role: projectMember.role,
      roleCode: projectMember.roleCode,
    };
  }
}
