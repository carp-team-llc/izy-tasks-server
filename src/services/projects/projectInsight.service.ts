import type { Request, Response } from "express";
import {
  TodayTasks,
  TopInsight,
} from "../../controllers/projects/ProjectInsights";

export class ProjectInsightService {
  async TopInsightService(req: Request, res: Response) {
    try {
      const { projectId } = req.body;
      const topInsight = await TopInsight(projectId);
      res.status(topInsight.statusCode).json({
        message: topInsight.message,
        data: topInsight.data,
      });
    } catch {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async TodayTasksService(req: Request, res: Response) {
    try {
      const { projectId, today } = req.body;
      const token = req.headers["authorization"]
        .split(" ")[1]
        .replace("Bearer ", "");
      const todayTasks = await TodayTasks({ projectId, today }, token);
      res.status(todayTasks.statusCode).json({
        message: todayTasks.message,
        data: todayTasks.data,
      });
    } catch {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
