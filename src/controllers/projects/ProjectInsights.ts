import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo";
import prisma from "../../utils/connection/connection";

export interface ProjectInsight {
  projectId?: string;
}

export interface TodayTasks {
  projectId?: string;
  today?: string;
}

export interface ProjectActivities {
  where: {};
  skip: number;
  take: number;
}

const TopInsight = async ({ projectId }: ProjectInsight) => {
  try {
    const ProjectTask = await prisma.tasks.findMany({
      where: {
        AND: [
          {
            projectId,
          },
        ],
      },
      select: {
        id: true,
        name: true,
        status: true,
        statusName: true,
        statusColor: true,
        estimatetime: true,
        updatedAt: true,
      },
    });

    const projectInfo = await prisma.project.findFirst({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        name: true,
        deadline: true,
        timeworking: true,
        totalEstimate: true,
      },
    });

    const totalTime = ProjectTask.reduce(
      (acc, task) => acc + Number(task.estimatetime),
      0
    );
    const completedTime = ProjectTask.filter(
      (task) => task.status === "completed"
    ).reduce((acc, task) => acc + Number(task.estimatetime), 0);
    const timeSpent = totalTime - completedTime;

    const totalTask = ProjectTask.length;
    const totalCompletedTask = ProjectTask.filter(
      (task) => task.status === "completed"
    ).length;
    const taskSpent = totalTask - totalCompletedTask;

    const totalLateTask = ProjectTask.filter(
      (task) => task.status === "late"
    ).length;
    const totalCancelTask = ProjectTask.filter(
      (task) => task.status === "cancel"
    ).length;

    return {
      statusCode: 201,
      message: "Top insights retrieved successfully",
      data: {
        totalTime,
        timeSpent,
        totalTask,
        taskSpent,
        totalCompletedTask,
        totalLateTask,
        totalCancelTask,
        projectDeadline: projectInfo.deadline,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Failed to retrieve top insights",
      data: null,
    };
  }
};

const TodayTasks = async ({ projectId, today }: TodayTasks, token: string) => {
  try {
    const userId = LoadUserInfo(token).userId;
    const todayTask = await prisma.tasks.findMany({
      where: {
        AND: [
          { employeeId: userId },
          { startTime: { gte: today } },
          { projectId: projectId },
        ],
      },
      select: {
        id: true,
        name: true,
        startTime: true,
        status: true,
        statusName: true,
        statusColor: true,
        employee: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                avatar: true,
              },
            },
          },
        },
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      statusCode: 201,
      message: "Today's tasks retrieved successfully",
      data: todayTask,
    };
  } catch (err) {
    return {
      statusCode: 500,
      message: "Failed to retrieve today's tasks",
      data: null,
    };
  }
};

const Activity = async (
  { where, skip, take }: ProjectActivities,
  projectId: string
) => {
  try {
    const projectActivites = await prisma.projectActivities.findMany({
      where: {
        AND: [
          {
            projectId,
          },
          where,
        ],
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });
    const totalActivities = await prisma.projectActivities.count({
      where: {
        AND: [
          {
            projectId,
          },
          where,
        ],
      }
    })
    return {
      statusCode: 201,
      message: "Project activities retrieved successfully",
      data: projectActivites,
    }
  } catch (err) {
    return {
      statusCode: 500,
      message: "Failed to retrieve activity",
      data: null,
    };
  }
};

export { TopInsight, TodayTasks, Activity };
