import type { Request, Response } from "express";
import { TopInsight } from "../../controllers/projects/ProjectInsights";


export class ProjectInsightService {
  async TopInsightService(req: Request, res: Response) {
    try {
      const { projectId } = req.body;
      const topInsight = await TopInsight(projectId);
      res.status(topInsight.statusCode).json({
        message: topInsight.message,
        data: topInsight.data
      });
    } catch {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}