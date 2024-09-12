import { Request, Response } from "express";
import { NotificationList } from "../../controllers/tasks/TaskNotifycation";

export class TaskNotification {
  async NotificationList(req: Request, res: Response) {
    try {
      const { take, skip } = req.body;
      const notifications = await NotificationList({
        take: take || 10,
        skip: skip || 0,
      });
      return res.status(notifications.statusCode).json({
        message: notifications.message || "",
        data: notifications.data,
      });
    } catch {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
