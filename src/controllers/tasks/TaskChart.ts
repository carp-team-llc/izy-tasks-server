import prisma from "../../utils/connection/connection";
import { tasks } from './dto/Tasks.dto';

interface GetTasksByStatusAndDateParams {
  status: string;
  exactDate: string;
}

const DailyChart = async ({
  exactDate,
  status,
}: GetTasksByStatusAndDateParams) => {
  try {
    const errors: string[] = [];
    if (!exactDate) errors.push("exactDate");
    if (!status) errors.push("status");

    if (errors.length > 0) {
      return {
        statusCode: 400,
        message: `The following fields are empty: ${errors.join(", ")}`,
      };
    }
    const dailyTask = await prisma.Tasks.findMany({
      where: {
        status: {
          in: status
        },
        createdAt: {
          gte: exactDate
        },
      },
    })
    return {
      statusCode: 200,
      message: "Success!",
      data: dailyTask,
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, message: "Bad request!" };
  }
};

export { DailyChart };
