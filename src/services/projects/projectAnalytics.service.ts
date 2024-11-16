import type { Request, Response } from "express";
import { Activate } from "../../controllers/projects/ProjectAnalytics";

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
}
