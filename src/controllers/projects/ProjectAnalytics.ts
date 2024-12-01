import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo";
import prisma from "../../utils/connection/connection";

const Activate = async (token: string) => {
  try {
    if (!token) {
      return {
        statusCode: 401,
        message: "Unauthorized",
      };
    }
    const userInfo = LoadUserInfo(token);
    const loadActivate = await prisma.projectActivities.findMany({
      where: {
        AND: [
          {
            actionById: userInfo?.userId,
          },
          {
            actionCode: "CHANGE_STATUS",
          },
        ],
      },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      statusCode: 200,
      message: "Project activated successfully",
      data: loadActivate,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error activating project",
    };
  }
};

const TaskCalender = async (
  token: string,
  today: string
) => {
  try {
    if (!token) {
      return {
        statusCode: 401,
        message: "Unauthorized",
      };
    }
    const userInfo = LoadUserInfo(token);

    const getListProject = await prisma.projectMember.findMany({
      where: {
        userId: userInfo?.userId,
      },
      select: {
        projectId: true,
      },
    });

    const getAllTask = await Promise.all(
      getListProject.map(async (item) => {
        const projectTask = await prisma.tasks.findMany({
          where: {
            AND: [
              { projectId: item.projectId },
              { employeeId: userInfo?.userId },
              { startTime: today },
            ],
          },
          select: {
            id: true,
            name: true,
            startTime: true,
            expirationDate: true,
            body: true,
            status: true,
            priority: true,
            employee: {
              select: {
                username: true,
              },
            },
            project: {
              select: {
                name: true,
              },
            },
          },
        });
        return projectTask;
      })
    );

    const filteredTasks = getAllTask.filter((tasks) => tasks.length > 0);

    return {
      statusCode: 200,
      message: "Task Calender",
      data: filteredTasks,
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Error in TaskCalender",
      data: [],
    };
  }
};

export { Activate, TaskCalender };
