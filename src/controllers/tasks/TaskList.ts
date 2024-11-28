import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo";
import prisma from "../../utils/connection/connection";
import type { TaskListDTO } from "./dto/tasksList.dto";

const TaskList = async (token: string) => {
  try {
    const taskList = await prisma.taskList.findMany({
      where: {
        authorId: LoadUserInfo(token)?.userId,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return {
      statusCode: 201,
      message: "Success!",
      data: taskList,
    };
  } catch (err) {
    return {
      statusCode: 500,
      message: "Error in fetching task list!",
    };
  }
};

const TaskListPagination = async ({ where, skip, take }: any, token) => {
  try {
    const userInfo = LoadUserInfo(token);
    const taskList = await prisma.taskList.findMany({
      where: {
        OR: [{ authorId: userInfo?.userId }],
        AND: where,
      },
      orderBy: {
        createdAt: "desc",
      },
      take,
      skip,
    });
    const totalTasks = await prisma.taskList.count({
      where: {
        OR: [{ authorId: userInfo?.userId }],
        AND: where,
      },
    });
    const totalPages = Math.ceil(totalTasks / take);
    return {
      statusCode: 201,
      message: "Success!",
      data: {
        taskList,
        currentPage: Math.ceil(skip / take) + 1,
        totalTasks,
        totalPages,
      },
    };
  } catch (err) {
    console.error("Err in Task list pagination: ", err);
  }
};

const DetailTaskList = async ({ id }) => {
  try {
    if (!id) {
      return { statusCode: 400, message: "Task ID is required for tgh" };
    }
    const detail = await prisma.taskList.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        avatar: true,
        tasks: {
          select: {
            id: true,
            name: true,
            status: true,
            statusName: true,
            statusColor: true,
            createdAt: true,
            updatedAt: true,
            expirationDate: true,
          },
        },
        authorId: true,
      },
    });
    return {
      statusCode: 201,
      message: "success!",
      detail: detail,
    };
  } catch (err) {
    console.error("Error: ", err);
    return { statusCode: 500, message: "Internal Server Error" };
  }
};

const CreateListTask = async (
  { name, description, avatar, tasks }: TaskListDTO,
  token: string
) => {
  try {
    const errors: string[] = [];
    if (!name) errors.push("name");

    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
        data: [
          {
            status: "error",
            note: "????????????????????????",
          },
        ],
      };
    }
    const userInfo = LoadUserInfo(token);
    const createListTask = await prisma.taskList.create({
      data: {
        name,
        description,
        avatar,
        tasks: tasks
          ? { connect: tasks.map((taskId) => ({ id: taskId })) }
          : undefined,
        authorId: userInfo?.userId,
      },
    });
    return {
      statusCode: 201,
      message: "Create Task List successfully!",
      data: createListTask,
    };
  } catch (err) {
    console.error("Error in Create Task List: ====> ");
    return {
      statusCode: 500,
      message: "Internal Server Error!",
      data: [],
    };
  }
};

const UpdateTaskList = async ({
  id,
  name,
  description,
  avatar,
  tasks,
}: TaskListDTO) => {
  try {
    const errors: string[] = [];
    if (!id) errors.push("id");
    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
        data: [
          {
            status: "error",
            note: "????????????????????????",
          },
        ],
      };
    }
    const updateTask = await prisma.taskList.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
        avatar,
        tasks: tasks
          ? { connect: tasks.map((taskId) => ({ id: taskId })) }
          : undefined,
      },
    });
    return {
      statusCode: 201,
      message: "Update task list successfully!",
      data: updateTask,
    };
  } catch (err) {
    console.error("Error in Update Task List: ====> ");
    return {
      statusCode: 500,
      message: "Internal Server Error!",
      data: [],
    };
  }
};

const DeleteTaskList = async (id: string) => {
  try {
    if (!id) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${id}`,
        data: [
          {
            status: "error",
            note: "????????????????????????",
          },
        ],
      };
    }
    const deleteTaskList = await prisma.taskList.delete({
      where: {
        id: id,
      },
    });
    return {
      statusCode: 201,
      message: `Task list have id: ${id} has been delete!`,
      data: [],
    };
  } catch (err) {
    console.error("Error in Delete Task List: ====> ");
    return {
      statusCode: 500,
      message: "Internal Server Error!",
      data: [],
    };
  }
};

export {
  TaskListPagination,
  CreateListTask,
  UpdateTaskList,
  DeleteTaskList,
  DetailTaskList,
  TaskList,
};
