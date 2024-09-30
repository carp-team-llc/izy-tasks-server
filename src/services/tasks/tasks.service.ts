import { Request, Response } from "express";
import { tasks, tasksVariables } from "../../controllers/tasks/dto";
import tasksPanigation from "../../controllers/tasks/TaskPanigation";
import { CreateTask, DeleteTask, UpdateTask } from "../../controllers/tasks/TaskManager";

export class TasksService {

    async tasksPagination (req: Request, res: Response) {
        try {
            const {
                where,
                skip,
                take,
            }: tasksVariables = req.body;
            const tasksList = await tasksPanigation({
                where: where,
                skip: skip,
                take: take
            });
            return res.status(tasksList.statusCode).json(tasksList.data)

        } catch (err) {
            return res.status(500).json({message: "Internal Server Error!"})
        }
    }

    async createTask (req: Request, res: Response) {
        try {
            const {
                name,
                body,
                status,
                statusColor,
                statusName,
                author,
                expirationDate,
                isExpiration,
                estimatetime,
                images,
                tags,
                projectId,
                team,
                employee
            }: tasks = req.body;
            const result = await CreateTask({
                name,
                body,
                status,
                statusColor,
                statusName,
                author,
                expirationDate,
                isExpiration,
                estimatetime,
                images,
                tags,
                projectId,
                team,
                employee
            });
            return res.json(result)

        } catch (err) {
            return res.status(500).json({message: "Internal Server Error!"})
        }
    }

    async updateTask (req: Request, res: Response) {
        try {
            const {
                id,
                name,
                body,
                status,
                statusColor,
                statusName,
                author,
                expirationDate,
                estimatetime,
                isExpiration,
                images,
                tags,
                projectId,
                team,
                employee
            }: tasks = req.body;

            const result = await UpdateTask({
                id,
                name,
                body,
                status,
                statusColor,
                statusName,
                author,
                expirationDate,
                estimatetime,
                isExpiration,
                images,
                tags,
                projectId,
                team,
                employee
            })
            return res.json(result)

        } catch (err) {
            return res.status(500).json({message: "Internal Server Error!"})
        }
    }

    async DeleteTask (req: Request, res: Response) {
        try {
            const { id } = req.body;
            const result = await DeleteTask({ id })
            return res.json(result)
        } catch (err) {
            return res.status(500).json({message: "Internal Server Error!"})
        }
    }

}