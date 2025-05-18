import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo";
import prisma from "../../utils/connection/connection";

import { addDays, startOfDay, endOfDay } from "date-fns";

const DashBoardInfomation = async (token: string) => {
  const userInfo = LoadUserInfo(token);

  const oneDayLater = startOfDay(addDays(new Date(), 1));
  const threeDaysLater = endOfDay(addDays(new Date(), 3));

  const userTaskCondition = {
    OR: [
      {
        AND: [{ projectId: { not: null } }, { employeeId: userInfo.userId }],
      },
      {
        AND: [{ projectId: null }, { authorId: userInfo.userId }],
      },
    ],
  };

  const [totalProject, totalTask, soonExpiredTasksCount, expirationTaskCount] =
    await Promise.all([
      prisma.project.count({
        where: {
          member: {
            some: {
              userId: userInfo.userId,
            },
          },
        },
      }),

      prisma.tasks.count({
        where: userTaskCondition,
      }),

      prisma.tasks.count({
        where: {
          ...userTaskCondition,
          expirationDate: {
            gte: oneDayLater,
            lte: threeDaysLater,
          },
        },
      }),

      prisma.tasks.count({
        where: {
          ...userTaskCondition,
          isExpiration: true,
        },
      }),
    ]);

  return {
    totalProject,
    totalTask,
    soonExpiredTasksCount,
    expirationTaskCount,
  };
};

const CurrentTasks = async (token: string) => {
  const userInfo = LoadUserInfo(token);

  const userTaskCondition = {
    OR: [
      {
        AND: [{ projectId: { not: null } }, { employeeId: userInfo.userId }],
      },
      {
        AND: [{ projectId: null }, { authorId: userInfo.userId }],
      },
    ],
  };

  const [inProgressTasks, lateTasks] = await Promise.all([
    await prisma.tasks.findMany({
      where: {
        ...userTaskCondition,
        status: "DOING",
      },
      select: {
        id: true,
        name: true,
        project: {
          select: {
            name: true,
          },
        },
        status: true,
        expirationDate: true,
      },
    }),

    await prisma.tasks.findMany({
      where: {
        ...userTaskCondition,
        status: "LATE",
      },
      select: {
        id: true,
        name: true,
        project: {
          select: {
            name: true,
          },
        },
        status: true,
        expirationDate: true,
      },
    }),
  ]);

  return {
    inProgressTasks,
    lateTasks,
  };
};

const UpcomingDeadlines = async () => {};

export { DashBoardInfomation, CurrentTasks };
