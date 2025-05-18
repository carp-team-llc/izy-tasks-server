import { Request, Response } from "express";
import { AuthGuard } from "../../utils/middleware/authentication/AuthGuard";
import { CurrentTasks, DashBoardInfomation } from "../../controllers/users/Dashboard";

export class DashboardService {
  async DashBoardInfomationService (req: Request, res: Response) {
    const token = AuthGuard(req);
    const result = await DashBoardInfomation(token);
    return res.status(200).json(result)
  }

  async CurrentTasksService (req: Request, res: Response) {
    const token = AuthGuard(req);
    const result = await CurrentTasks(token);
    return res.status(200).json(result)
  }
}