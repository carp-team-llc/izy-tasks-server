import { ProjectDto, type Variables } from "./dto/Project.dto";
import prisma from "../../utils/connection/connection";
import { EnumData } from "../../constant/enumData";

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

const ProjectPanigation = async (variable: Variables) => {
  const { where, skip, take } = variable;
  try {
    const project = await prisma.project.findMany({
      where,
      skip,
      take,
    });
    const totalTasks = await prisma.project.count({ where });
    const totalPages = Math.ceil(totalTasks / take);
    return {
      statusCode: 201,
      data: {
        project: project,
        currentPage: Math.ceil(skip / take) + 1,
        totalTasks,
        totalPages,
      },
    };
  } catch (err) {
    console.log(err)
    return { statusCode: 500, message: "Bad request!" };
  }
};

const CreateProject = async ({
  name,
  description,
  createdAt,
  timeworking,
  permission,
  member,
  tasks,
  avatar,
  deadline,
}: ProjectDto) => {
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

    const newProject = await prisma.project.create({
      data: {
        name: name,
        description: description,
        createdAt,
        permission,
        timeworking,
        tasks: tasks
          ? { connect: tasks.map((taskId) => ({ id: taskId })) }
          : undefined,
        avatar: avatar,
        deadline: deadline,
      },
    });

    let addedMembers = [];
    if (member && member.length > 0) {
      const projectMemberData = member.map((projectMember) => {
        const { roleName, engName, permission } = getRoleInfo(projectMember.role);
        return {
          userId: projectMember.userId,
          teamId: newProject.id,
          role: projectMember.role,
          roleName,
          roleEngName: engName,
          permission,
        }
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
      }
    };
  } catch (error) {
    console.error("Error in UpdateTask:", error);
    return { statusCode: 500, message: "Internal Server Error" };
  }
};

const UpdateProject = async ({
  id,
  name,
  description,
  createdAt,
  member,
  tasks,
  avatar,
  permission,
  timeworking,
  deadline,
}: ProjectDto) => {
  try {

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
        avatar: avatar,
        deadline: deadline,
      },
    });
    
    let addedMembers = [];
    if (member && member.length > 0) {
      const projectMemberData = member.map((projectMember) => {
        const { roleName, engName, permission } = getRoleInfo(projectMember.role);
        return {
          userId: projectMember.userId,
          teamId: updateProject.id,
          role: projectMember.role,
          roleName,
          roleEngName: engName,
          permission,
        }
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
      message: `Update project: '${name}'` ,
      data: {
        ...updateProject,
        member: addedMembers
      }
    };
  } catch (error) {
    console.error("Error in UpdateTask:", error);
    return { statusCode: 500, message: "Internal Server Error" };
  }
};

const DeleteProject = async (id) => {
  try {

    if (!id) {
      return { statusCode: 400, message: "Project ID is required for delete" };
    }

    const deleteProject = await prisma.project.delete({
      where: { id: id },
    });

    return { 
      statusCode: 200, 
      message: `Project '${id}' has been delete!`,
      data: deleteProject
    };
  } catch (error) {
    console.error("Error in UpdateTask:", error);
    return { statusCode: 500, message: "Internal Server Error" };
  }
};

export { ProjectPanigation, CreateProject, UpdateProject, DeleteProject };
