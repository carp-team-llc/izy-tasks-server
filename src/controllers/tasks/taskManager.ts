import { tasks } from "./dto";
import prisma from "../../utils/connection/connection";

const CreateTask = async (
    {
        name,
        body,
        status,
        statusColor,
        statusName,
        author,
        expirationDate,
        isExpiration,
        images,
        tags,
        project,
        team,
        employee
    }: tasks
) => {
    try {
        const errors: string[] = [];
        if (!name) errors.push("name");
        if (!body) errors.push("body");
        if (!status) errors.push("status");
        if (!statusColor) errors.push("statusColor");
        if (!statusName) errors.push("statusName");
        if (!author) errors.push("author");
        if (!expirationDate) errors.push("expirationDate");
        if (images.length === 0) errors.push("images");
        if (tags.length === 0) errors.push("tags");

        if (errors.length > 0) {
            return { statusCode: 400, message: `The following fields are empty: ${errors.join(", ")}` };
        }

        const newTask = await prisma.tasks.create({
            data: {
                name,
                body,
                status,
                statusColor,
                statusName,
                author,
                expirationDate,
                isExpiration,
                images,
                tags,
                project,
                team,
                employee
            },
        });
        return { statusCode: 200, message: "Create new task successfully" };

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
        statusColor,
        statusName,
        author,
        expirationDate,
        isExpiration,
        images,
        tags,
        project,
        team,
        employee
    }: tasks
) => {
    try {
        if (!id) {
            return { statusCode: 400, message: "Task ID is required for update" };
        }

        const errors: string[] = [];
        if (!name) errors.push("name");
        if (!body) errors.push("body");
        if (!status) errors.push("status");
        if (!statusColor) errors.push("statusColor");
        if (!statusName) errors.push("statusName");
        if (!author) errors.push("author");
        if (!expirationDate) errors.push("expirationDate");
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
                statusColor,
                statusName,
                author,
                expirationDate,
                isExpiration,
                images,
                tags,
                project,
                team,
                employee
            },
        });

        return { statusCode: 200, message: "Task updated successfully" };
    } catch (error) {
        console.error('Error in UpdateTask:', error);
        return { statusCode: 500, message: "Internal Server Error" };
    }
}

const DeleteTask = async ({ id }: tasks) => {
    try {
        if (!id) {
            return { statusCode: 400, message: "Task ID is required for delete"}
        }
        const deleteTask = await prisma.tasks.delete({
            where: {id}
        })
        return { statusCode: 200, message: "Task has been delete"}
    } catch (error) {
        console.error('Error in UpdateTask:', error);
        return { statusCode: 500, message: "Internal Server Error" };
    }
}

export { CreateTask, UpdateTask, DeleteTask }