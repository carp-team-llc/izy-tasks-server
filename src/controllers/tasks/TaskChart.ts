import { startOfMonth, endOfMonth } from "date-fns";
import prisma from "../../utils/connection/connection";
import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo";
import Helper from "../../utils/helper";
import { startOfDay, endOfDay } from "date-fns";

interface GetTasksByStatusAndDateParams {
  status: string[];
  createdAt: string;
}

interface WeeklyTaskParams {
  fromDate: string;
  toDate: string;
  status: any;
}

interface MonthlyTaskParams {
  status: string[];
  month: string;
}

const DailyChart = async (
  Variables: GetTasksByStatusAndDateParams,
  token: string
) => {
  try {
    const errors: string[] = [];
    if (!Variables.createdAt) errors.push("createdAt");
    if (!Variables.status) errors.push("status");

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

    const startDate = startOfDay(new Date(Variables.createdAt));
    const endDate = endOfDay(new Date(Variables.createdAt));
    const userInfo = LoadUserInfo(token);
    const taskChart = await prisma.tasks.groupBy({
      by: ["status"],
      where: {
        OR: [
          { authorId: userInfo?.userId },
          {
            project: {
              member: {
                some: {
                  userId: userInfo?.userId,
                },
              },
            },
          },
        ],
        status: {
          in: Variables.status,
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
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

    const loadTotalStatus: number[] = getStatusInfo.map((item: any) => {
      return item?.total;
    });
    const totalTask = loadTotalStatus.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    return {
      statusCode: 200,
      message: "Success!",
      data: {
        taskChart: processedTaskChart,
        totalTask,
      },
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, message: err };
  }
};

const WeeklyChart = async (
  { fromDate, toDate, status }: WeeklyTaskParams,
  token: string
) => {
  try {
    const errors: string[] = [];
    if (!fromDate) errors.push("fromDate");
    if (!toDate) errors.push("toDate");
    if (!status) errors.push("status");

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
    const startOfDay = new Date(fromDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(toDate);
    endOfDay.setHours(23, 59, 59, 999);

    const weeklyTotal = await prisma.tasks.groupBy({
      by: ["status"],
      where: {
        status: {
          in: status,
        },
        OR: [
          { authorId: userInfo?.userId },
          {
            project: {
              member: {
                some: {
                  userId: userInfo?.userId,
                },
              },
            },
          },
        ],
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
      _count: {
        status: true,
      },
    });

    const getStatusInfo = weeklyTotal?.map((task) => {
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
    const loadTotalStatus: number[] = getStatusInfo.map((item: any) => {
      return item?.total;
    });
    const totalTask = loadTotalStatus.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return {
      statusCode: 200,
      message: "Success!",
      data: {
        taskChart: processedTaskChart,
        totalTask: totalTask,
      },
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, message: "Bad request!" };
  }
};

const MonthlyChart = async (
  { status, month }: MonthlyTaskParams,
  token: string
) => {
  try {
    const date = new Date(month);

    const startDate = startOfMonth(new Date(date));
    const endDate = endOfMonth(new Date(date));

    const userInfo = LoadUserInfo(token);
    const monthlyTask = await prisma.tasks.findMany({
      where: {
        status: {
          in: status,
        },
        OR: [
          { authorId: userInfo?.userId },
          {
            project: {
              member: {
                some: {
                  userId: userInfo?.userId,
                },
              },
            },
          },
        ],
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalMonthlyTask = await prisma.tasks.groupBy({
      by: ["status"],
      where: {
        status: {
          in: status,
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        status: true,
      },
    });
    return {
      statusCode: 200,
      message: "Success!",
      data: monthlyTask,
      total: totalMonthlyTask,
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, message: "Bad request!" };
  }
};

export { DailyChart, WeeklyChart, MonthlyChart };
