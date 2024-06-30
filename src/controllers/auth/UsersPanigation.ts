
import prisma from "../../utils/connection/connection";
import { UserPagination } from "./dto";

const usersPanigaiton = async (variable: UserPagination) => {
    const { where = {}, skip = 0, take = 10 } = variable;
    try {
        const users = await prisma.user.findMany({
            where,
            skip,
            take,
        });
        const totalUsers = await prisma.user.count({ where });
        const totalPages = Math.ceil(totalUsers / take);
        return {
            statusCode: 200,
            data: {
                users,
                currentPage: Math.ceil(skip / take) + 1,
                totalPages,
                totalUsers,
            },
        }
    } catch {
        return {statusCode: 500, message: "Bad Request!"}
    }
}

export default usersPanigaiton;