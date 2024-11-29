import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo";
import prisma from "../../utils/connection/connection";
import Helper from "../../utils/helper";
export interface ProjectInsight {
  projectId?: string;
}

export interface TodayTasksParams {
  projectId?: string;
  today?: string;
}

export interface ProjectActivities {
  where: {};
  skip: number;
  take: number;
}

const TopInsight = async ({ projectId }: ProjectInsight, token: string) => {
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

    const userInfo = LoadUserInfo(token);

    const isMember = await prisma.projectMember.findFirst({
      where: {
        AND: [{ projectId }, { userId: userInfo.userId }],
      },
    });

    if (!isMember) {
      return {
        statusCode: 403,
        message: "Forbidden: You are not a member of this project",
      };
    }

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
    const increaseCompleted = (totalCompletedTask * 100) / totalTask;

    const totalLateTask = ProjectTask.filter(
      (task) => task.status === "late"
    ).length;
    const increaseLate = (totalLateTask * 100) / totalTask;

    const totalCancelTask = ProjectTask.filter(
      (task) => task.status === "cancel"
    ).length;

    const taskSpent = totalTask - totalCompletedTask;

    if (
      totalTime >
      Number(projectInfo.totalEstimate) - projectInfo.timeworking * 3
    ) {
      const lateTime = Math.round(
        (totalTime - Number(projectInfo.totalEstimate)) /
          Number(projectInfo.timeworking)
      );
      const message = `The project is delayed by ${lateTime} days because the total estimated time for tasks exceeds the planned duration. Please review and adjust the schedule!`;
      const messCode = "ALERT";
      return {
        statusCode: 201,
        message: "Top insights retrieved successfully",
        data: {
          totalTime,
          timeSpent,
          totalTask,
          taskSpent,
          completedTask: {
            totalCompletedTask,
            increaseCompleted,
          },
          lateTask: {
            totalLateTask,
            increaseLate,
          },
          totalCancelTask,
          totalEst: projectInfo.totalEstimate,
          projectMessageCode: messCode,
          projectMessage: message,
          projectDeadline: projectInfo.deadline,
        },
      };
    } else {
      const messCode = "SUCCESS";
      const message = "Project is on schedule";
      return {
        statusCode: 201,
        message: "Top insights retrieved successfully",
        data: {
          totalTime,
          timeSpent,
          totalTask,
          taskSpent,
          completedTask: {
            totalCompletedTask,
            increaseCompleted,
          },
          lateTask: {
            totalLateTask,
            increaseLate,
          },
          totalCancelTask,
          totalEst: Number(projectInfo.totalEstimate),
          projectMessageCode: messCode,
          projectMess: message,
          projectDeadline: projectInfo.deadline,
        },
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: "Failed to retrieve top insights",
      data: null,
    };
  }
};

const TodayTasks = async (
  { projectId, today }: TodayTasksParams,
  token: string
) => {
  try {
    const errors: string[] = [];
    if (!projectId) errors.push("projectId");
    if (!today) errors.push("today");
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
  projectId: string,
  token: string
) => {
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
    return {
      statusCode: 201,
      message: "Project activities retrieved successfully",
      data: projectActivites,
    };
  } catch (err) {
    return {
      statusCode: 500,
      message: "Failed to retrieve activity",
      data: null,
    };
  }
};
const TotalTaskChart = async (
  projectId: string,
  token: string
) => {
  try {
    const userInfo = LoadUserInfo(token);
    const isMember = await prisma.projectMember.findFirst({
      where: {
        AND: [{ projectId }, { userId: userInfo.userId }],
      },
    });

    if (!isMember) {
      return {
        statusCode: 403,
        message: "Forbidden: You are not a member of this project",
      };
    }


    const taskChart = await prisma.tasks.groupBy({
      by: ["status"],
      where: {
        OR: [
          {
            projectId
          },
        ],
        status: {
          in: ["COMPLETED", "CANCEL", "PENDING", "LATE", "NEW", "DOING"],
        },
      },
      _count: {
        status: true,
      },
    });

    const getStatusInfo = taskChart?.map((task) => {
      return {
        total: task?._count?.status,
        name: task?.status,
      };
    });

    const processedTaskChart = getStatusInfo.map((task) => {
      const statusInfo = Helper.HandleStatus({ status: task.name });

      return {
        ...task,
        statusInfo,
      };
    });
    return {
      statusCode: 200,
      message: "Success!",
      data: {
        taskChart: processedTaskChart,
      },
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, message: err};
  }
};

const ProjectWorkload = async (
  token: string,
  projectId: string,
  status?: string[],
  fromDate?: string,
  toDate?: string
) => {
  try {
    const errors: string[] = [];
    if (!projectId) errors.push("projectId");
    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
      };
    }

    const getProjectMembers = await prisma.projectMember.findMany({
      where: {
        projectId
      },
      select: {
        user: {
          select: {
            id: true,
            username: true,
          },
        }
      }
    });

    const CountTaskById = await Promise.all(
      getProjectMembers.map(async (item) => {
        const totalTask = await prisma.tasks.count({
          where: {
            projectId,
            AND: [
              { employeeId: item.user.id },
              {
                createdAt: {
                  gte: fromDate || "1970-11-10T08:05:05.000Z",
                  lte: toDate || new Date().toISOString(),
                },
              },
            ],
          },
        });
        return {
          userId: item.user.id,
          username: item.user.username,
          totalTasks: totalTask,
        };
      })
    );

    return {
      statusCode: 201,
      message: "Project workload retrieved successfully",
      data: CountTaskById,
    }
  } catch (err) {
    return {
      statusCode: 500,
      message: "Failed to retrieve project workload",
      data: null,
    };
  }
};

export { TopInsight, TodayTasks, Activity, ProjectWorkload, TotalTaskChart };
