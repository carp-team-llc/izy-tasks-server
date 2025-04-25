import type { Request, Response } from "express";
import {
  Activity,
  ProjectWorkload,
  TodayTasks,
  TopInsight,
  TotalTaskChart,
} from "../../controllers/projects/ProjectInsights";
import { AuthGuard } from "../../utils/middleware/authentication/AuthGuard";

export class ProjectInsightService {
  async TopInsightService(req: Request, res: Response) {
    try {
      const { projectId } = req.body;
      const token = AuthGuard(req)
      const topInsight = await TopInsight({ projectId }, token);
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
      const token = AuthGuard(req)
      const todayTasks = await TodayTasks({ projectId, today }, token);
      res.status(todayTasks.statusCode).json({
        message: todayTasks.message,
        data: todayTasks.data,
      });
    } catch {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async ActivityService(req: Request, res: Response) {
    try {
      const { projectId, where, skip, take } = req.body;
      const token = AuthGuard(req)
      const activity = await Activity({ where, skip, take }, projectId, token);
      res.status(activity.statusCode).json({
        message: activity.message,
        data: activity.data,
      });
    } catch {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
  async TotalChartService(req: Request, res: Response) {
    try {
      const { projectId } = req.body;
      const token = AuthGuard(req)
      const totalChart = await TotalTaskChart(projectId, token);
      res.status(totalChart.statusCode).json({
        message: totalChart.message,
        data: totalChart.data,
      });
    } catch {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async ProjectWorkloadService(req: Request, res: Response) {
    try {
      const { projectId, status, fromDate, toDate } = req.body;
      const token = AuthGuard(req)
      const projectWorkload = await ProjectWorkload(
        token,
        projectId,
        status,
        fromDate,
        toDate
      );
      res.status(projectWorkload.statusCode).json({
        message: projectWorkload.message,
        data: projectWorkload.data,
      })
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
