
import prisma from "../../utils/connection/connection";
import { tasksVariables } from "./dto/tasks.dto";
import { LoadUserInfo } from '../../utils/middleware/permission/LoadUserInfo';

const tasksPanigation = async (variales: tasksVariables, token: string) => {
    const { where, skip, take } = variales;
    const userInfo = LoadUserInfo(token)
    try {
        const tasks = await prisma.tasks.findMany({
            where: {
                AND: [
                    { authorId: userInfo?.userId },
                    {
                        project: null,
                    },
                    where
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take,
        });
        const totalTasks = await prisma.tasks.count({ 
            where: {
                AND: [
                    { authorId: userInfo?.userId },
                    {
                        project: null,
                    },
                    where
                ],
            },
        });
        const totalPages = Math.ceil(totalTasks / take);
        return {
            statusCode: 200,
            message: "Tasks successfully fetched",
            data: {
                tasks,
                currentPage: Math.ceil(skip / take) + 1,
                totalTasks,
                totalPages
            }
        }
    } catch {
        return {statusCode: 500, message: "Bad request!"}
    }
}

const recentTaskPagination = async (variable: tasksVariables, token: string) => {
    const { where, skip, take } = variable;
    const userId = LoadUserInfo(token)?.userId;
    try {
        const recentTask = await prisma.recentTask.findMany({
            where: {
                AND: [
                    { userId: userId },
                    where
                ],
            },
            include: {
                task: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        statusColor: true,
                        statusName: true,
                        updatedAt: true,
                        expirationDate: true,
                    }
                }
            },
            orderBy: {
                openedAt: 'desc',
            },
        })
        const totalRecent = await prisma.recentTask.count({
            where: {
                AND: [
                    { userId: userId },
                    where
                ],
            },
        })
        const totalPages = Math.ceil(totalRecent / take);
        return {
            statusCode: 200,
            message: "Recent Tasks successfully fetched",
            data: {
                recentTask,
                currentPage: Math.ceil(skip / take) + 1,
                totalTasks: totalRecent,
                totalPages
            }
        }
    } catch (err) {
        return {statusCode: 500, message: "Bad request!"}
    }
}

export { tasksPanigation, recentTaskPagination } ;