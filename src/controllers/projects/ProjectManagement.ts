import prisma from "../../utils/connection/connection";

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
      data: addTask
    }

  } catch (error) {
    console.error("Error in Add Task:", error);
    return { statusCode: 500, messsage: "Error from Add Task" };
  }
};

export { AddTask }
