import { Request, Response } from "express";
import { DailyChart } from "../../controllers/tasks/TaskChart";

export class ChartService {
  async DailyChart ( req: Request, res: Response ) {
    try {
      const {
        exactDate,
        status
      } = req.body;
      const dailyChart = await DailyChart({
        exactDate,
        status,
      });
      res.status(dailyChart.statusCode).json({
        message: dailyChart.message,
        data: dailyChart.data
      })
    } catch (err) {
      console.error(err)
      res.status(500).json({message: "Internal Server Error!"})
    }
  }
}