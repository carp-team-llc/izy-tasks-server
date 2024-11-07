
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

export default tasksPanigation;