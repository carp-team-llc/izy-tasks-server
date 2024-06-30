
import prisma from "../../utils/connection/connection";
import { tasksVariables } from "./dto";

const tasksPanigation = async (variales: tasksVariables) => {
    const { where = {}, skip = 0, take = 10} = variales;
    try {
        const tasks = await prisma.tasks.findMany({
            where,
            skip,
            take
        });
        const totalTasks = await prisma.tasks.count({ where });
        const totalPages = Math.ceil(totalTasks / take);
        return {
            statusCode: 500,
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