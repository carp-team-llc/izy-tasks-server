import { Request, Response } from "express";
import { CreateListTask, DeleteTaskList, UpdateTaskList } from "../../controllers/tasks/TaskList";

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
  async UpdateTaskListService(req: Request, res: Response) {
    const { id, name, description, avatar, tasks } = req.body;
    const updateTaskList = await UpdateTaskList({
      id: id,
      name: name,
      description: description,
      avatar: avatar,
      tasks: tasks
    })
    res.status(updateTaskList.statusCode).json({
      message: updateTaskList.message,
      data: updateTaskList.data
    })
  }
  async DeleteTaskListService(req: Request, res: Response) {
    const { id } = req.body;
    const deleteTaskList = await DeleteTaskList(id);
    res.status(deleteTaskList.statusCode).json({
      message: deleteTaskList.message,
      data: deleteTaskList.data
    })
  }
}
