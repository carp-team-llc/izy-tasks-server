import { Request, Response } from "express";
import {
  CreateListTask,
  DeleteTaskList,
  DetailTaskList,
  TaskList,
  TaskListPagination,
  UpdateTaskList,
} from "../../controllers/tasks/TaskList";

export class TaskListService {
  async TaskList(req: Request, res: Response) {
    try {
      const token = req.headers["authorization"]
        .split(" ")[1]
        .replace("Bearer ", "");
      const result = await TaskList(token);
      res.status(result.statusCode).json({
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  }

  async TaskListPaginationService(req: Request, res: Response) {
    const { where, skip, take } = req.body;
    const token = req.headers["authorization"]
      .split(" ")[1]
      .replace("Bearer ", "");
    const taskListPagination = await TaskListPagination(
      {
        where,
        take,
        skip,
      },
      token
    );
    res.status(taskListPagination.statusCode).json({
      message: taskListPagination.message,
      data: taskListPagination.data,
    });
  }

  async DetailTaskListService(req: Request, res: Response) {
    const id = req.body;
    const result = await DetailTaskList(id);
    return res.status(result.statusCode).json({
      message: result.message,
      detail: result.detail,
    });
  }

  async CreateTaskListService(req: Request, res: Response) {
    const { name, description, avatar, tasks } = req.body;
    const token = req.headers["authorization"]
      .split(" ")[1]
      .replace("Bearer ", "");
    const createTaskList = await CreateListTask(
      {
        name: name,
        description: description,
        avatar: avatar,
        tasks: tasks,
      },
      token
    );
    res.status(createTaskList.statusCode).json({
      message: createTaskList.message,
      data: createTaskList.data,
    });
  }
  async UpdateTaskListService(req: Request, res: Response) {
    const { id, name, description, avatar, tasks } = req.body;
    const updateTaskList = await UpdateTaskList({
      id: id,
      name: name,
      description: description,
      avatar: avatar,
      tasks: tasks,
    });
    res.status(updateTaskList.statusCode).json({
      message: updateTaskList.message,
      data: updateTaskList.data,
    });
  }
  async DeleteTaskListService(req: Request, res: Response) {
    const { id } = req.body;
    const deleteTaskList = await DeleteTaskList(id);
    res.status(deleteTaskList.statusCode).json({
      message: deleteTaskList.message,
      data: deleteTaskList.data,
    });
  }
}
