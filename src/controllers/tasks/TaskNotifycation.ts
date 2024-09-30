
import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo";
import prisma from "../../utils/connection/connection";

type Variable = {
  where: any;
  skip: number,
  take: number,
}

const NotificationList = async ({ where, skip, take }: Variable, token: string) => {
  try {

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const userInfo = LoadUserInfo(token);
    const changesToday = await prisma.taskHistory.findMany({
      where: {
        createdAt: {
          gte: startOfToday,
        },
        OR: [
          {authorId: userInfo?.userId},
        ],
      },
      orderBy: {
        createdAt: 'desc',
      }
    })
    if (changesToday.length === 0) {
      return {
        statusCode: 404,
        message: 'No changes today',
        data: []
      }
    }
    const changes = changesToday.map((history) => ({
      taskId: history.taskId,
      changes: history.changes,
      action: history.action,
      createdAt: history.createdAt
    }));
    
    return {
      statusCode: 200,
      message: "Load notification",
      data: changes,
    }
  } catch (err) {
    console.error(err);
    return {
      status: 500,
      message: "Internal Server Error",
    }
  }
}

export { NotificationList }