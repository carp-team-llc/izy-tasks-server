import { Request, Response } from "express";
import { CreateListTask } from "../../controllers/tasks/TaskList";

export class TaskListService {
  async CreateTaskListService(req: Request, res: Response) {
    const { name, description, avatar, tasks } = req.body;
    const token = req.headers["authorization"]
      .split(" ")[1]
      .replace("Bearer ", "");
    const createTaskList = await CreateListTask({
      name: name,
      description: description,
      avatar: avatar,
      tasks: tasks,
    }, token);
    res.status(createTaskList.statusCode).json({
      message: createTaskList.message,
      data: createTaskList.data
    })
  }
}
