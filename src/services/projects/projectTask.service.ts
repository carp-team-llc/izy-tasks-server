import { Request, Response } from "express";
import {
  CreateTask,
  ProjectTask,
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
}
