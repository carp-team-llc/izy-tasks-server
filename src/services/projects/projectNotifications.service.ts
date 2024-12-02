import { Request, Response } from "express";
import ProjectNotifications from "../../controllers/projects/ProjectNotifications";

export class ProjectNotificationsService {
  async NotificationsList(req: Request, res: Response) {
    try {
      const { projectId } = req.body;
      const token = req.headers["authorization"]
        .split(" ")[1]
        .replace("Bearer ", "");

      const projectNotifications = await ProjectNotifications(projectId, token);
      res
        .status(200)
        .json({
          message: projectNotifications.message,
          data: projectNotifications.data,
        });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
