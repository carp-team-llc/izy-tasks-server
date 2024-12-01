import type { Request, Response } from "express";
import { Activate, TaskCalender } from "../../controllers/projects/ProjectAnalytics";

export class ProjectAnalyticsService {
  async ProjectActivate(req: Request, res: Response) {
    try {
      const token = req.headers["authorization"]
        .split(" ")[1]
        .replace("Bearer ", "");
      const result = await Activate(token);
      res.status(result.statusCode).json({
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async TaskCalenderService (req: Request, res: Response) {
    try {
      const { projectId, today } = req.body;
      const token = req.headers["authorization"].split(" ")[1].replace("Bearer ", "");
      const result = await TaskCalender(token, today);
      res.status(result.statusCode).json({
        message: result.message,
        data: result.data,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
