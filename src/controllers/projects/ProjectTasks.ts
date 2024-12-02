import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo";
import { EnumData } from "../../constant/enumData";
import prisma from "../../utils/connection/connection";

export interface ProjectTask {
  id?: string;
  name: string;
  body: string;
  status?: string;
  statusColor?: string;
  statusName?: string;
  createdAt?: string;
  startTime: Date;
  expirationDate: Date;
  isExpiration: boolean;
  images: string[];
  tags?: string[];
  projectId?: string;
  team?: string;
  taskListId?: string;
  priority?: string;
  priorityName?: string;
  progress?: number;
  employee?: any;
  author?: any;
  estimatetime?: string;
}

const HandlePriority = ({ priority }) => {
  if (typeof priority !== "string" || priority.length === 0) {
    return EnumData.PriorityType.Low;
  }

  const priorityInfo =
    EnumData.PriorityType[
      priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()
    ];

  if (priorityInfo) {
    return {
      name: priorityInfo.name,
      color: priorityInfo.color,
    };
  }

  return EnumData.PriorityType.Low;
};

const CreateTask = async (
  {
    name,
    body,
    startTime,
    expirationDate,
    isExpiration,
    estimatetime,
    images,
    tags,
    projectId,
    team,
    employee,
    priority,
    progress,
  }: ProjectTask,
  token: string
) => {
  try {
    const errors: string[] = [];
    if (!name) errors.push("name");
    if (!body) errors.push("body");
    if (!startTime) errors.push("startTime");
    if (!expirationDate) errors.push("expirationDate");

    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
      };
    }

    const userInfo = LoadUserInfo(token);
    const creatTask = await prisma.tasks.create({
      data: {
        name,
        body,
        status: EnumData.StatusType.New.code,
        statusColor: EnumData.StatusType.New.color,
        statusName: EnumData.StatusType.New.name,
        author: {
          connect: { id: userInfo.userId },
        },
        startTime,
        expirationDate,
        isExpiration,

        estimatetime,
        images: images || [],
        tags: tags || [],
        project: projectId ? { connect: { id: projectId } } : undefined,
        team: team || null,
        employee: {
          connect: { id: employee || userInfo.userId },
        },
        priority: priority || EnumData.PriorityType.Low.code,
        priorityName: HandlePriority({
          priority: priority || EnumData.PriorityType.Low.code,
        }).name,
        progress,
      },
    });

    if (creatTask) {
      await prisma.projectActivities.create({
        data: {
          project: {
            connect: { id: projectId },
          },
          actionCode: EnumData.ProjectAction.CreateTask.code,
          actionName: EnumData.ProjectAction.CreateTask.name,
          actionEngName: EnumData.ProjectAction.CreateTask.engName,
          action: `Create new task with name: '${name}'`,
          activity: {
            name: creatTask?.name,
            body: creatTask?.body,
            author: creatTask?.authorId,
            startTime: creatTask?.startTime,
            expirationDate: creatTask?.expirationDate,
            isExpiration: creatTask?.isExpiration,
            estimatetime: creatTask?.estimatetime,
            images: creatTask?.images,
            tags: creatTask?.tags,
            projectId: creatTask?.projectId,
            team: creatTask?.team,
            employee: creatTask?.employeeId,
            priority: creatTask?.priority,
            progress: creatTask?.progress,
          },
          actionBy: { connect: { id: userInfo.userId } },
        },
      });
    }
    return {
      statusCode: 201,
      message: "Task created successfully",
      data: creatTask,
    };
  } catch (err) {
    return {
      statusCode: 500,
      message: "Error creating task in project",
      data: null,
    };
  }
};

const UpdateTask = async (
  {
    name,
    body,
    startTime,
    expirationDate,
    isExpiration,
    estimatetime,
    images,
    tags,
    projectId,
    team,
    employee,
    priority,
    progress,
  }: ProjectTask,
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
    if (!token) {
      return {
        statusCode: 401,
        message: "Unauthorized",
      };
    }
    const userInfo = LoadUserInfo(token);
    const updateTask = await prisma.tasks.update({
      where: { id },
      data: {
        name,
        body,
        status: EnumData.StatusType.New.code,
        statusColor: EnumData.StatusType.New.color,
        statusName: EnumData.StatusType.New.name,
        author: {
          connect: { id: userInfo.userId },
        },
        startTime,
        expirationDate,
        isExpiration,

        estimatetime,
        images: images || [],
        tags: tags || [],
        project: projectId ? { connect: { id: projectId } } : undefined,
        team: team || null,
        employee: {
          connect: { id: employee || userInfo.userId },
        },
        priority: priority || EnumData.PriorityType.Low.code,
        priorityName: HandlePriority({
          priority: priority || EnumData.PriorityType.Low.code,
        }).name,
        progress,
      },
    });
    if (updateTask) {
      await prisma.projectActivities.create({
        data: {
          project: {
            connect: { id: projectId },
          },
          actionCode: EnumData.ProjectAction.UpdateTask.code,
          actionName: EnumData.ProjectAction.UpdateTask.name,
          actionEngName: EnumData.ProjectAction.UpdateTask.engName,
          action: `Update task: '${name}'`,
          activity: {
            name: updateTask?.name,
            body: updateTask?.body,
            author: updateTask?.authorId,
            startTime: updateTask?.startTime,
            expirationDate: updateTask?.expirationDate,
            isExpiration: updateTask?.isExpiration,
            estimatetime: updateTask?.estimatetime,
            images: updateTask?.images,
            tags: updateTask?.tags,
            projectId: updateTask?.projectId,
            team: updateTask?.team,
            employee: updateTask?.employeeId,
            priority: updateTask?.priority,
            progress: updateTask?.progress,
          },
          actionBy: { connect: { id: userInfo.userId } },
        },
      });
    }
  } catch (err) {
    return {
      statusCode: 500,
      message: "Error updating task",
      data: null,
    };
  }
};

const ChangeStatus = async (
  id: string,
  projectId: string,
  statusKey: string,
  token: string
) => {
  try {
    if (!id) {
      return { statusCode: 400, message: "Missing required parameter: id" };
    }
    if (!token) {
      return { statusCode: 401, message: "Unauthorized" };
    }
    const userInfo = LoadUserInfo(token);
    const statusInfo = EnumData.StatusType[statusKey];
    const task = await prisma.tasks.findUnique({
      where: { id },
    });
    if (task.projectId !== projectId) {
      return {
        statusCode: 403,
        message: "Unauthorized to update task in this project.",
      };
    }
    if (
      task.status === EnumData.StatusType.Cancel.code &&
      statusKey !== "New"
    ) {
      return {
        statusCode: 400,
        message:
          "Task is in 'Cancel' state and can only be changed back to 'New'.",
      };
    }

    if (
      task.status === EnumData.StatusType.Completed.code &&
      statusKey === "Cancel"
    ) {
      return {
        statusCode: 400,
        message:
          "Task is in 'Completed' state and cannot be changed to 'Cancel'.",
      };
    }

    if (task.status === statusInfo.code) {
      return {
        statusCode: 400,
        message: `Task is already in the '${statusInfo.code}' state and cannot be changed.`,
      };
    }
    const updatedTask = await prisma.tasks.update({
      where: {
        id,
      },
      data: {
        status: statusInfo.code,
        statusName: statusInfo.name,
        statusColor: statusInfo.color,
      },
    });
    if (updatedTask) {
      await prisma.projectActivities.create({
        data: {
          project: {
            connect: { id: task.projectId },
          },
          actionCode: EnumData.ProjectAction.ChangeStatus.code,
          actionName: EnumData.ProjectAction.ChangeStatus.name,
          actionEngName: EnumData.ProjectAction.ChangeStatus.engName,
          action: `Update task: '${task?.name}'`,
          activity: {
            name: updatedTask?.name,
            body: updatedTask?.body,
            author: updatedTask?.authorId,
            startTime: updatedTask?.startTime,
            expirationDate: updatedTask?.expirationDate,
            isExpiration: updatedTask?.isExpiration,
            estimatetime: updatedTask?.estimatetime,
            status: updatedTask?.status,
            statusColor: updatedTask?.statusColor,
            statusName: updatedTask?.statusName,
            images: updatedTask?.images,
            tags: updatedTask?.tags,
            projectId: updatedTask?.projectId,
            team: updatedTask?.team,
            employee: updatedTask?.employeeId,
            priority: updatedTask?.priority,
            progress: updatedTask?.progress,
          },
          actionBy: { connect: { id: userInfo.userId } },
        },
      });
    }
    return {
      statusCode: 200,
      message: "Task status changed successfully!",
      data: updatedTask,
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, message: "Error in change status!" };
  }
};
const ProjectTaskList = async (projectId, token) => {
  try {
    if (!projectId) {
      return { statusCode: 400, message: "Task ID is required for tgh" };
    }
    const userInfo = LoadUserInfo(token);
    const tasklist = await prisma.tasks.findMany({
      where: {
        AND: [{ authorId: userInfo?.userId }, { projectId }],
      },
    });
    return {
      statusCode: 201,
      message: "success!",
      data: tasklist,
    };
  } catch (err) {
    console.error("Error: ", err);
    return { statusCode: 500, message: "Internal Server Error" };
  }
};

export { CreateTask, UpdateTask, ChangeStatus, ProjectTaskList };
