import { ProjectDto, type Variables } from "./dto/Project.dto";
import prisma from "../../utils/connection/connection";
import { EnumData } from "../../constant/enumData";
import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo";

const getRoleInfo = (role: string) => {
  const projectRole = EnumData.ProjectRole[role];

  if (!projectRole) {
    throw new Error(`Role ${role} not found`);
  }

  return {
    roleName: projectRole.name,
    engName: projectRole.engName,
    permission: projectRole.PERMISSION,
  };
};

const ProjectPanigation = async (variable: Variables, token: string) => {
  const { where, skip, take } = variable;
  const userInfo = LoadUserInfo(token);
  try {
    const project = await prisma.project.findMany({
      where: {
        AND: [
          where,
          {
            member: {
              some: {
                userId: userInfo?.userId
              }
            }
          }
        ]
      },
      skip,
      take,
    });
    const totalProject = await prisma.project.count({ 
      where: {
        AND: [
          where,
          {
            member: {
              some: {
                userId: userInfo?.userId
              }
            }
          }
        ]
      }
    });
    const totalPages = Math.ceil(totalProject / take);
    return {
      statusCode: 201,
      data: {
        project: project,
        currentPage: Math.ceil(skip / take) + 1,
        totalProject,
        totalPages,
      },
    };
  } catch (err) {
    console.log(err);
    return { statusCode: 500, message: "Bad request!" };
  }
};

const DetailProject = async (
  id: string,
  token: string
) => {
  try {
    if (!id) {
      return {
        statusCode: 400,
        message: "Missing required parameter: id",
      };
    }

    const userInfo = LoadUserInfo(token);
    const user = await prisma.projectMember.findFirst({
      where: {
        userId: userInfo?.userId as string,
        projectId: id,
      },
    });

    if (!user) {
      return {
        statusCode: 403,
        message: "You are not a member of this project!",
      };
    }

    const detailProject = await prisma.project.findFirst({
      where: {
        id
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
        startTime: true,
        deadline: true,
        teamId: true,
        timeworking: true,
        totalEstimate: true,
        member: true,
      }
    })
    
    return {
      statusCode: 200,
      data: detailProject,
    }
  } catch (err) {
    console.log(err);
    return { statusCode: 500, message: "Bad request!" };
  }
};

const CreateProject = async (
  {
    name,
    description,
    createdAt,
    timeworking,
    permission,
    member,
    tasks,
    teamId,
    avatar,
    startTime,
    deadline,
  }: ProjectDto,
  token: string
) => {
  try {
    const errors: string[] = [];
    if (!name) errors.push("name");
    if (!deadline) errors.push("deadline");

    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
      };
    }

    const userInfo = LoadUserInfo(token);

    const deadlineDate = new Date(deadline);
    const startTimeDate = new Date(startTime);
    const totalEstimateInDays =
      (deadlineDate.getTime() - startTimeDate.getTime()) /
      (1000 * 60 * 60 * 24);

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        createdAt,
        permission: "",
        timeworking,
        tasks: tasks
          ? { connect: tasks.map((taskId) => ({ id: taskId })) }
          : undefined,
        avatar,
        startTime,
        deadline,
        teamId,
        totalEstimate: totalEstimateInDays.toString(),
      },
    });

    await prisma.projectMember.create({
      data: {
        userId: userInfo?.userId,
        projectId: newProject.id,
        teamId: teamId,
        role: "Administrator",
        roleCode: EnumData.ProjectRole.Administrator.code,
        roleName: EnumData.ProjectRole.Administrator.name,
        roleEngName: EnumData.ProjectRole.Administrator.engName,
        permission: EnumData.ProjectRole.Administrator.PERMISSION,
      },
    });

    let addedMembers = [];
    if (member && member.length > 0) {
      const projectMemberData = member.map((projectMember) => {
        const { roleName, engName, permission } = getRoleInfo(
          projectMember.role
        );
        return {
          userId: projectMember.userId,
          teamId: newProject.id,
          projectId: newProject.id,
          role: projectMember.role,
          roleName: roleName,
          roleEngName: engName,
          permission: permission,
        };
      });

      await prisma.projectMember.createMany({
        data: projectMemberData,
      });

      const userIds = member.map((m) => m.userId);
      const foundMembers = await prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });

      addedMembers = foundMembers;
    }

    return {
      statusCode: 200,
      message: `Project "${name}" created successfully`,
      data: {
        ...newProject,
        member: addedMembers,
      },
    };
  } catch (error) {
    console.error("Error in UpdateTask:", error);
    return { statusCode: 500, message: "Internal Server Error" };
  }
};

const UpdateProject = async (
  {
    id,
    name,
    description,
    createdAt,
    member,
    tasks,
    teamId,
    avatar,
    permission,
    timeworking,
    startTime,
    deadline,
  }: ProjectDto,
  token: string
) => {
  try {
    const userInfo = LoadUserInfo(token);

    const user = await prisma.projectMember.findFirst({
      where: {
        userId: userInfo?.userId as string,
        projectId: id,
      },
      select: {
        permission: true,
      },
    });

    if (user.permission !== EnumData.ProjectRole.Administrator.PERMISSION) {
      return {
        statusCode: 401,
        message: "You do not have permission to perform this function!",
      };
    }

    const deadlineDate = new Date(deadline);
    const startTimeDate = new Date(startTime);
    const totalEstimateInDays =
      (deadlineDate.getTime() - startTimeDate.getTime()) /
      (1000 * 60 * 60 * 24);

    const updateProject = await prisma.project.update({
      where: { id: id },
      data: {
        name: name,
        description: description,
        createdAt,
        timeworking,
        permission,
        tasks: tasks
          ? { connect: tasks.map((taskId) => ({ id: taskId })) }
          : undefined,
        teamId,
        avatar: avatar,
        startTime: startTime,
        deadline: deadline,
        totalEstimate: totalEstimateInDays.toString(),
      },
    });

    let addedMembers = [];
    if (member && member.length > 0) {
      const projectMemberData = member.map((projectMember) => {
        const { roleName, engName, permission } = getRoleInfo(
          projectMember.role
        );
        return {
          userId: projectMember.userId,
          teamId: updateProject.id,
          projectId: updateProject.id,
          role: projectMember.role,
          roleName: roleName,
          roleEngName: engName,
          permission: permission,
        };
      });

      await prisma.projectMember.createMany({
        data: projectMemberData,
      });

      const userIds = member.map((m) => m.userId);
      const foundMembers = await prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });

      addedMembers = foundMembers;
    }

    return {
      statusCode: 200,
      message: `Update project: '${name}'`,
      data: {
        ...updateProject,
        member: addedMembers,
      },
    };
  } catch (error) {
    console.error("Error in UpdateTask:", error);
    return { statusCode: 500, message: "Internal Server Error" };
  }
};

const DeleteProject = async (id, token: string) => {
  try {
    if (!id) {
      return { statusCode: 400, message: "Project ID is required for delete" };
    }

    const userInfo = LoadUserInfo(token);

    const user = await prisma.projectMember.findFirst({
      where: {
        userId: userInfo?.userId as string,
        projectId: id,
      },
      select: {
        permission: true,
      },
    });

    if (user.permission !== EnumData.ProjectRole.Administrator.PERMISSION) {
      return {
        statusCode: 401,
        message: "You do not have permission to perform this function!",
      };
    }

    const deleteProject = await prisma.project.delete({
      where: { id: id },
    });

    return {
      statusCode: 200,
      message: `Project '${id}' has been delete!`,
      data: deleteProject,
    };
  } catch (error) {
    console.error("Error in UpdateTask:", error);
    return { statusCode: 500, message: "Internal Server Error" };
  }
};

export {
  ProjectPanigation,
  DetailProject,
  CreateProject,
  UpdateProject,
  DeleteProject,
};