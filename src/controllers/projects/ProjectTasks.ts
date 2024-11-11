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
    }
  } catch (err) {
    return {
      statusCode: 500,
      message: "Error creating task in project",
      data: null,
    };
  }
};

export { CreateTask };