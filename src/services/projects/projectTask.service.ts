import { Request, Response } from "express";
import {
  ChangeStatus,
  CreateTask,
  ProjectTask,
  ProjectTaskList,
  UpdateTask,
} from "../../controllers/projects/ProjectTasks";
import { AuthGuard } from "../../utils/middleware/authentication/AuthGuard";

export class ProjectTaskService {
  async CreateProjectTask(req: Request, res: Response) {
    try {
      const {
        name,
        body,
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
      }: ProjectTask = req.body;
      const token = AuthGuard(req);
      const projectTask = await CreateTask(
        {
          name,
          body,
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
        },
        token
      );
      res.status(201).json({
        message: "Project Task created successfully",
        data: projectTask,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async UpdateProjectTask(req: Request, res: Response) {
    try {
      const {
        id,
        name,
        body,
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
      }: ProjectTask = req.body;
      const token = AuthGuard(req);
      const projectTask = await UpdateTask(
        {
          name,
          body,
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
        },
        id,
        token
      );
      res.status(201).json({
        message: "Project Task updated successfully",
        data: projectTask,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async ChangeStatusTask(req: Request, res: Response) {
    try {
      const {
        id,
        statusKey,
        projectId,
      }: {
        id: string;
        statusKey: string;
        projectId: string;
      } = req.body;
      const token = AuthGuard(req);
      const projectTask = await ChangeStatus(id, projectId, statusKey, token);
      res.status(200).json({
        message: projectTask.message,
        data: projectTask.data,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async TaskList(req: Request, res: Response) {
    try {
      const {
        projectId,
        expirationDate,
        isExpiration,
        employeeId,
        startTime,
        authorId,
        priority,
        status,
      }: {
        projectId: string;
        expirationDate?: string;
        isExpiration?: boolean;
        employeeId?: string;
        startTime?: string;
        authorId?: string;
        priority?: string;
        status?: string;
      } = req.body;

      const token = AuthGuard(req);

      const projectTask = await ProjectTaskList({
        projectId,
        token,
        expirationDate,
        isExpiration,
        employeeId,
        startTime,
        authorId,
        priority,
        status,
      });

      res.status(projectTask.statusCode).json({
        message: projectTask.message,
        data: projectTask.data ?? null,
      });
    } catch (err) {
      console.error("TaskList error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}