import { EnumData } from "../../constant/enumData";
import prisma from "../../utils/connection/connection";
import { ProjectMemberInfo } from "./utils/ProjectMemberInfo";

// #region show members list
const ShowMembersList = async (projectId: string, token: string) => {
  const projectMemberInfo = new ProjectMemberInfo();
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

    const isProjectMember = await projectMemberInfo.IsProjectMember(projectId, token);
    if (!isProjectMember?.isMember) {
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
// #endregion

// #region add member
const addMember = async (projectId: string, userId: string, token: string) => {
  const projectMemberInfo = new ProjectMemberInfo();
  try {
    const errors: string[] = [];
    if (!projectId) errors.push("projectId");
    if (!userId) errors.push("userId");
    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
      };
    }

    // kiểm tra người gửi request có phải là thành viên của project không
    const isProjectMember = await projectMemberInfo.IsProjectMember(
      projectId,
      token
    );

    console.log("isProjectMember", isProjectMember.isMember);
    if (!isProjectMember?.isMember) {
      return {
        statusCode: 403,
        message: "Forbidden: You are not a member of this project",
      };
    }

    // kiểm tra role của người gửi yêu cầu
    const memberRole = await projectMemberInfo.ProjectMemberRole(
      projectId,
      token
    );
    if (
      memberRole?.role !== "Administrator" &&
      memberRole?.role !== "Moderator"
    ) {
      return {
        statusCode: 403,
        message: "Forbidden: You are not authorized to add members",
      };
    }

    // kiểm tra người sắp được thêm vào có phải là thành viên của project không
    const isJoinedProject = await projectMemberInfo.IsProjectMember(
      projectId,
      undefined,
      userId,
    );
    if (isJoinedProject?.isMember) {
      return {
        statusCode: 400,
        message: "User is already a member of this project",
      };
    }

    const addMember = await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role: "Member",
        roleCode: EnumData.ProjectRole.Member.code,
        roleName: EnumData.ProjectRole.Member.name,
        roleEngName: EnumData.ProjectRole.Member.engName,
        permission: EnumData.ProjectRole.Member.PERMISSION,
      },
    });
    return {
      statusCode: 201,
      message: "Member added successfully",
      data: addMember,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error adding member",
    };
  }
};
// #endregion

export { ShowMembersList, addMember };
