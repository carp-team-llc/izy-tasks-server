import { EnumData } from "../../constant/enumData";
import prisma from "../../utils/connection/connection";

const RoleList = () => {
  try {
    const roleList = EnumData.ProjectRole;
    return {
      statusCode: 201,
      message: "Success!",
      data: roleList
    }
  } catch (err) {
    console.error("Error in Add Task:", err);
    return { statusCode: 500, messsage: "Role error!" }; 
  }
}

const AddTask = async ({ projectId, taskId }) => {
  try {
    const findTask = await prisma.tasks.findFirst({
      where: { id: taskId },
    });

    const findProject = await prisma.project.findFirst({
      where: { id: projectId },
    });

    if (!findTask) {
      return { statusCode: 404, message: `Task not found` };
    }

    if (!findProject) {
      return { statusCode: 404, message: "Project not found" };
    }

    const addTask = await prisma.tasks.update({
      where: { id: taskId },
      data: { projectId: projectId },
    });

    return {
      statusCode: 200,
      message: "Task added successfully",
      data: addTask,
    };
  } catch (error) {
    console.error("Error in Add Task:", error);
    return { statusCode: 500, messsage: "Error from Add Task" };
  }
};

const AddRole = async ({ projectId, memberId, role }: any) => {
  try {
    const errors: string[] = [];
    if (!projectId) errors.push("projectId");
    if (!memberId) errors.push("memberId");
    if (!role) errors.push("role");

    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
      };
    }
    const addRole = await prisma.projectMember.update({
      where:{ id: projectId },
      data: {
        role,
        userId: memberId,
      }
    })
    return {
      statusCode: 201,
      message: "Add role for member success!",
      data: addRole,
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      message: "Internal Server Error!",
    };
  }
};

export { AddTask, AddRole, RoleList };
