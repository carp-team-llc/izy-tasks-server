import { Request, Response } from "express";
import { tasks, tasksVariables } from "../../controllers/tasks/dto/tasks.dto";
import { CreateTask, DeleteTask, TaskDetail, UpdateTask } from "../../controllers/tasks/taskManager";
import { recentTaskPagination, tasksPanigation } from "../../controllers/tasks/taskPanigation";

export class TasksService {

    async tasksPagination (req: Request, res: Response) {
        try {
            const {
                where,
                skip,
                take,
            }: tasksVariables = req.body;
            const token = req.headers['authorization'].split(' ')[1].replace('Bearer ', '');
            const tasksList = await tasksPanigation({
                where: where,
                skip: skip,
                take: take
            }, token);
            return res.status(tasksList.statusCode).json(tasksList.data)

        } catch (err) {
            return res.status(500).json({message: "Internal Server Error!"})
        }
    }

    async recentTaskPagination (req: Request, res: Response) {
        try {
            const {
                where,
                skip,
                take,
            }: tasksVariables = req.body;
            const token = req.headers['authorization'].split(' ')[1].replace('Bearer ', '');
            const tasksList = await recentTaskPagination({
                where: where,
                skip: skip,
                take: take
            }, token);
            return res.status(tasksList.statusCode).json(tasksList.data)

        } catch (err) {
            return res.status(500).json({message: "Internal Server Error!"})
        }
    }

    async taskDetail (req: Request, res: Response) {
        const id = req.body;
        const token = req.headers['authorization'].split(' ')[1].replace('Bearer ', '');
        const result = await TaskDetail(id, token);
        return res.status(result.statusCode).json({
            message: result.message,
            detail: result.detail
        })
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
                startTime,
                expirationDate,
                isExpiration,
                estimatetime,
                images,
                tags,
                projectId,
                taskListId,
                team,
                employee
            }: tasks = req.body;
            const token = req.headers['authorization'].split(' ')[1].replace('Bearer ', '');
            const result = await CreateTask({
                name,
                body,
                status,
                statusColor,
                statusName,
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
                employee
            }, token);
            return res.status(result.statusCode).json({
                message: result.message,
                task: result.task
            })

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
                startTime,
                expirationDate,
                estimatetime,
                isExpiration,
                images,
                tags,
                projectId,
                team,
                employee
            }: tasks = req.body;
            const token = req.headers['authorization'].split(' ')[1].replace('Bearer ', '');

            const result = await UpdateTask({
                id,
                name,
                body,
                status,
                statusColor,
                statusName,
                author,
                startTime,
                expirationDate,
                estimatetime,
                isExpiration,
                images,
                tags,
                projectId,
                team,
                employee
            }, token)
            return res.status(result.statusCode).json({
                message: result.message,
                task: result.task
            })

        } catch (err) {
            return res.status(500).json({message: "Internal Server Error!"})
        }
    }

    async DeleteTask (req: Request, res: Response) {
        try {
            const { id } = req.body;
            const token = req.headers['authorization'].split(' ')[1].replace('Bearer ', '');
            const result = await DeleteTask({ id }, token)
            return res.status(result.statusCode).json({
                message: result.message,
            })
        } catch (err) {
            return res.status(500).json({message: "Internal Server Error!"})
        }
    }

}