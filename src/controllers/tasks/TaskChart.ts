import { startOfMonth, endOfMonth } from "date-fns";
import prisma from "../../utils/connection/connection";
import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo";

interface GetTasksByStatusAndDateParams {
  status: string[];
  createdAt: string;
}

interface WeeklyTaskParams {
  fromDate: string;
  toDate: string;
  status: string[];
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
    const userInfo = LoadUserInfo(token)
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
          gte: Variables.createdAt,
        },
      },
      _count: {
        status: true,
      },
    });
    const totalTask = taskChart.length;
    return {
      statusCode: 200,
      message: "Success!",
      data: {
        taskChart,
        totalTask,
      },
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, message: "Bad request!" };
  }
};

const WeeklyChart = async ({ fromDate, toDate, status }: WeeklyTaskParams) => {
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
    const weeklyTask = await prisma.tasks.findMany({
      where: {
        status: {
          in: status,
        },
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const weeklyTotal = await prisma.tasks.groupBy({
      by: ["status"],
      where: {
        status: {
          in: status,
        },
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
      _count: {
        status: true,
      },
    });

    return {
      statusCode: 200,
      message: "Success!",
      data: weeklyTask,
      total: weeklyTotal,
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, message: "Bad request!" };
  }
};

const MonthlyChart = async ({ status, month }: MonthlyTaskParams) => {
  try {
    const date = new Date(month);

    const startDate = startOfMonth(new Date(date));
    const endDate = endOfMonth(new Date(date));

    const monthlyTask = await prisma.tasks.findMany({
      where: {
        status: {
          in: status,
        },
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
