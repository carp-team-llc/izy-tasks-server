import { Request, Response } from "express";
import { tasks, tasksVariables } from "../../controllers/tasks/dto";
import tasksPanigation from "../../controllers/tasks/taskPanigation";
import { CreateTask, DeleteTask, UpdateTask } from "../../controllers/tasks/taskManager";

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
            res.status(tasksList.statusCode).json(tasksList.data)

        } catch (err) {
            res.status(500).json({message: "Internal Server Error!"})
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
                images,
                tags,
                project,
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
                images,
                tags,
                project,
                team,
                employee
            });
            res.json(result)

        } catch (err) {
            res.status(500).json({message: "Internal Server Error!"})
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
                isExpiration,
                images,
                tags,
                project,
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
                isExpiration,
                images,
                tags,
                project,
                team,
                employee
            })
            res.json(result)

        } catch (err) {
            res.status(500).json({message: "Internal Server Error!"})
        }
    }

    async DeleteTask (req: Request, res: Response) {
        try {
            const { id } = req.body;
            const result = await DeleteTask({ id })
            res.json(result)
        } catch (err) {
            res.status(500).json({message: "Internal Server Error!"})
        }
    }

}