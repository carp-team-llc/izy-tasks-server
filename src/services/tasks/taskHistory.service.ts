import { Request, Response } from "express";
import { TaskActivity } from "../../controllers/tasks/TaskHistory";


export class TaskHistoryService {
  async TaskActivity (req: Request, res: Response) {
    try {
      const { taskId } = req.body;
      const taskActivity = await TaskActivity(taskId);
      res.status(taskActivity.statusCode).json({
        message: taskActivity.message,
        data: taskActivity.data
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}