import { tasks } from "./dto/tasks.dto";
import prisma from '../../utils/connection/connection';
import { EnumData } from "../../constant/enumData";
import { LoadUserInfo } from "../../utils/middleware/permission/LoadUserInfo";

const HandleStatus = ({status}) => {
    const statusInfo = EnumData.StatusType[status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()];

    if (statusInfo) {
        return {
            name: statusInfo.name,
            color: statusInfo.color
        };
    }

    return null;
};

const HandlePriority = ({ priority }) => {
    if (typeof priority !== 'string' || priority.length === 0) {
        return EnumData.PriorityType.Low;
    }

    const priorityInfo = EnumData.PriorityType[priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()];

    if (priorityInfo) {
        return {
            name: priorityInfo.name,
            color: priorityInfo.color
        };
    }

    return EnumData.PriorityType.Low;
};

const TaskDetail = async ({ id }) => {
    try {
        if (!id) {
            return { statusCode: 400, message: "Task ID is required for tgh" };
        }
        const detail = await prisma.tasks.findFirst({
            where: { id },
            include: {
                project: {
                    select: {
                        name: true,
                        team: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                taskList: {
                    select: {
                        name: true,
                    },
                },
                employee: {
                    select: {
                        username: true,
                        profile: {
                            select: {
                                avatar: true,
                            },
                        }
                    },
                },
                author: {
                    select: {
                        username: true,
                        profile: {
                            select: {
                                avatar: true,
                            },
                        }
                    },
                },
                comments: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        user: {
                            select: {
                                username: true,
                                profile: {
                                    select: {
                                        avatar: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 5,
                }
            },
        });

        return {
            statusCode: 201,
            message: "success!",
            detail: detail
        }
    } catch (err) {
        console.error('Error: ', err);
        return { statusCode: 500, message: "Internal Server Error" };
    }
}

const CreateTask = async (
    {
        name,
        body,
        author,
        startTime,
        expirationDate,
        isExpiration, 
        estimatetime,
        images,
        tags,
        projectId,
        taskListId,
        team,
        employee,
        priority,
        progress,
    }: tasks,
    token: string
) => {
    try {
        const errors: string[] = [];
        if (!name) errors.push("name");
        if (!body) errors.push("body");
        if (!expirationDate) errors.push("expirationDate");

        if (errors.length > 0) {
            return { statusCode: 400, message: `The following fields are empty: ${errors.join(", ")}` };
        }

        const userInfo = LoadUserInfo(token);
        const newTask = await prisma.tasks.create({
            data: {
                name,
                body,
                status: EnumData.StatusType.New.code,
                statusColor: EnumData.StatusType.New.color,
                statusName: EnumData.StatusType.New.name,
                author:  {
                    connect: { id: userInfo.userId }
                },
                startTime,
                expirationDate,
                isExpiration,
                estimatetime,
                images: images || [],
                tags: tags || [],
                project: projectId ? { connect: { id: projectId } } : undefined,
                team: team || null,
                taskList: taskListId ? { connect: { id: taskListId } } : undefined,
                employee: {
                    connect: { id: employee || userInfo.userId }
                },
                priority: priority || EnumData.PriorityType.Low.code,
                priorityName: HandlePriority({ priority: priority || EnumData.PriorityType.Low.code }).name,
                progress,
            },
        });

        if (newTask) {
            await prisma.taskHistory.create({
                data: {
                    taskId: newTask.id,
                    action: `Creat new task with name: '${name}'`,
                    changes: {
                        title: newTask.name,
                        body: newTask.body,
                        status: newTask.status,
                        statusColor: newTask.statusColor,
                        statusName: newTask.statusName,
                        author: newTask.authorId,
                        expirationDate: newTask.expirationDate,
                        images: newTask.images,
                        tags: newTask.tags,
                        projectId: newTask.projectId,
                        team: newTask.team,
                        employee: newTask.employeeId,
                    },
                    authorId: userInfo?.userId,
                }
            })
        }

        return { statusCode: 200, message: "Create new task successfully", task: newTask };

    } catch (error) {
        console.error('Error in CreateTask:', error);
        return { statusCode: 500, message: "Internal Server Error" };
    }
}

const UpdateTask = async (
    {
        id,
        name,
        body,
        status,
        author,
        startTime,
        expirationDate,
        isExpiration,
        estimatetime,
        images,
        tags,
        projectId,
        team,
        employee,
        priority,
        progress,
    }: tasks,
    token: string
) => {
    try {
        if (!id) {
            return { statusCode: 400, message: "Task ID is required for update" };
        }
        const priorityData = HandlePriority({ priority: priority || EnumData.PriorityType.Low.code });

        const userInfo = LoadUserInfo(token);

        const updateData: any = {
            ...(name && { name }),
            ...(body && { body }),
            ...(status && { status }),
            ...(status && {
                statusColor: HandleStatus({ status }).color,
                statusName: HandleStatus({ status }).name,
            }),
            ...(startTime && { startTime }),
            ...(expirationDate && { expirationDate }),
            ...(isExpiration !== undefined && { isExpiration }),
            ...(estimatetime && { estimatetime }),
            ...(images && { images }),
            ...(tags && { tags }),
            ...(projectId && { project: { connect: { id: projectId } } }),
            ...(team && { team }),
            ...(employee && { employee }),
            ...(priority && { priority }),
            ...(progress !== undefined && { progress }),
            priorityName: priorityData.name,
        };

        if (userInfo?.userId) {
            updateData.author = { connect: { id: userInfo.userId } };
        }

        const updatedTask = await prisma.tasks.update({
            where: { id },
            data: updateData,
        });

        // create history
        if (updatedTask) {
            await prisma.taskHistory.create({
                data: {
                    taskId: updatedTask.id,
                    action: `Update task with ID: '${id}'`,
                    changes: {
                        title: updatedTask.name,
                        body: updatedTask.body,
                        status: updatedTask.status,
                        statusColor: updatedTask.statusColor,
                        statusName: updatedTask.statusName,
                        author: updatedTask.authorId,
                        expirationDate: updatedTask.expirationDate,
                        estimatetime: updatedTask.estimatetime,
                        images: updatedTask.images,
                        tags: updatedTask.tags,
                        project: updatedTask.projectId,
                        team: updatedTask.team,
                        employee: updatedTask.employeeId,
                    },
                    authorId: userInfo?.userId,
                }
            })
        }

        return { statusCode: 200, message: "Task updated successfully", task: updatedTask };
    } catch (error) {
        console.error('Error in UpdateTask:', error);
        return { statusCode: 500, message: "Internal Server Error" };
    }
}

const DeleteTask = async ({ id }, token: string) => {
    try {
        if (!id) {
            return { statusCode: 400, message: "Task ID is required for delete"}
        }

        const userInfo = LoadUserInfo(token);

        await prisma.taskHistory.deleteMany({
            where: { taskId: id }
        });

        const deleteTask = await prisma.tasks.delete({
            where: {id: id}
        })

        // create history
        if (deleteTask) {
            await prisma.taskHistory.create({
                data: {
                    taskId: id,
                    action: `Delete task with id: '${id}'`,
                    changes: {},
                    authorId: userInfo?.userId,
                }
            })
        }

        return { statusCode: 200, message: `Task '${id}' has been delete!`}
    } catch (error) {
        console.error('Error in UpdateTask:', error);
        return { statusCode: 500, message: "Internal Server Error" };
    }
}

export { TaskDetail, CreateTask, UpdateTask, DeleteTask }