
import prisma from "../../utils/connection/connection";
import { tasksVariables } from "./dto";
import { LoadUserInfo } from '../../utils/middleware/permission/LoadUserInfo';

const tasksPanigation = async (variales: tasksVariables, token: string) => {
    const { where, skip, take } = variales;
    const userInfo = LoadUserInfo(token)
    console.log(userInfo)
    try {
        const tasks = await prisma.tasks.findMany({
            where: {
                OR: [
                    { authorId: userInfo?.userId },
                    {
                        project: {
                            member: {
                                some: {
                                    userId: userInfo?.userId
                                }
                            }
                        }
                    }
                ],
                AND: where,
            },
            skip,
            take,
        });
        const totalTasks = await prisma.tasks.count({ 
            where: {
                OR: [
                    { authorId: userInfo?.userId },
                    {
                        project: {
                            member: {
                                some: {
                                    userId: userInfo?.userId
                                }
                            }
                        }
                    }
                ],
                AND: where,
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