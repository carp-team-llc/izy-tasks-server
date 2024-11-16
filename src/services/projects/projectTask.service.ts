import { Request, Response } from "express";
import {
  ChangeStatus,
  CreateTask,
  ProjectTask,
  UpdateTask,
} from "../../controllers/projects/ProjectTasks";

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
      const token = req.headers["authorization"]
        .split(" ")[1]
        .replace("Bearer ", "");
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
      const token = req.headers["authorization"]
        .split(" ")[1]
        .replace("Bearer ", "");
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
      }: {
        id: string;
        statusKey: string;
      } = req.body;
      const token = req.headers["authorization"]
        .split(" ")[1]
        .replace("Bearer ", "");
      const projectTask = await ChangeStatus(id, statusKey, token);
      res.status(200).json({
        message: projectTask.message,
        data: projectTask.data,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
