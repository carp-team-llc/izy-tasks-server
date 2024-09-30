import { tasks } from "./dto";
import prisma from '../../utils/connection/connection';
import { EnumData } from "../../constant/enumData";

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

const CreateTask = async (
    {
        name,
        body,
        author,
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
    }: tasks
) => {
    try {
        const errors: string[] = [];
        if (!name) errors.push("name");
        if (!body) errors.push("body");
        if (!author) errors.push("author");
        if (!expirationDate) errors.push("expirationDate");
        if (images.length === 0) errors.push("images");

        if (errors.length > 0) {
            return { statusCode: 400, message: `The following fields are empty: ${errors.join(", ")}` };
        }

        const newTask = await prisma.tasks.create({
            data: {
                name,
                body,
                status: EnumData.StatusType.New.code,
                statusColor: EnumData.StatusType.New.color,
                statusName: EnumData.StatusType.New.name,
                author:  {
                    connect: { id: author }
                },
                expirationDate,
                isExpiration,
                estimatetime,
                images,
                tags,
                project: projectId ? { connect: { id: projectId } } : undefined,
                team: team || null,
                employee: {
                    connect: { id: employee }
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
                    }
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
    }: tasks
) => {
    try {
        if (!id) {
            return { statusCode: 400, message: "Task ID is required for update" };
        }
        const priorityData = HandlePriority({ priority: priority || EnumData.PriorityType.Low.code });
        const errors: string[] = [];
        if (!name) errors.push("name");
        if (!body) errors.push("body");
        if (!status) errors.push("status");
        if (!author) errors.push("author");
        if (!expirationDate) errors.push("expirationDate");
        if (!estimatetime) errors.push("estimatetime");
        if (images.length === 0) errors.push("images");
        if (tags.length === 0) errors.push("tags");

        if (errors.length > 0) {
            return { statusCode: 400, message: `The following fields are empty: ${errors.join(", ")}` };
        }

        const updatedTask = await prisma.tasks.update({
            where: { id },
            data: {
                name,
                body,
                status,
                statusColor: HandleStatus({status}).color,
                statusName: HandleStatus({status}).name,
                author,
                expirationDate,
                estimatetime,
                isExpiration,
                images,
                tags,
                project: projectId ? { connect: { id: projectId } } : undefined,
                team,
                employee,
                priority: priority || EnumData.PriorityType.Low.code,
                priorityName: priorityData.name,
                progress,
            },
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
                    }
                }
            })
        }

        return { statusCode: 200, message: "Task updated successfully", task: updatedTask };
    } catch (error) {
        console.error('Error in UpdateTask:', error);
        return { statusCode: 500, message: "Internal Server Error" };
    }
}

const DeleteTask = async ({ id }) => {
    try {
        if (!id) {
            return { statusCode: 400, message: "Task ID is required for delete"}
        }

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
                    changes: {}
                }
            })
        }

        return { statusCode: 200, message: `Task '${id}' has been delete!`}
    } catch (error) {
        console.error('Error in UpdateTask:', error);
        return { statusCode: 500, message: "Internal Server Error" };
    }
}

export { CreateTask, UpdateTask, DeleteTask }