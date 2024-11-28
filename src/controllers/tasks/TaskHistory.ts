import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo";
import prisma from "../../utils/connection/connection";

const TaskActivity = async (taskId: string) => {
  try {
    const tasks = await prisma.taskHistory.findMany({
      where: {
        taskId: taskId,
      },
      select: {
        id: true,
        createdAt: true,
        action: true,
        authorId: true,
      },
    });
    return {
      statusCode: 200,
      message: "",
      data: tasks,
    };
  } catch (error) {
    console.error("Error in TaskActivity:", error);
    return {
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
};

const TaskHistoryPagination = async () => {};

export { TaskActivity, TaskHistoryPagination };