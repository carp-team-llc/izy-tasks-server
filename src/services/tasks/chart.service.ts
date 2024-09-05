import { Request, Response } from "express";
import { DailyChart, WeeklyChart } from "../../controllers/tasks/TaskChart";

export class ChartService {
  async DailyChart(req: Request, res: Response) {
    try {
      const { createdAt, status } = req.body;
      const dailyChart = await DailyChart({
        createdAt,
        status,
      });
      res.status(dailyChart.statusCode).json({
        message: dailyChart.message,
        data: dailyChart.data,
        total: dailyChart.total,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  }
  async WeeklyChart(req: Request, res: Response) {
    try {
      const { fromDate, toDate, status } = req.body;
      const weeklyChart = await WeeklyChart({
        fromDate,
        toDate,
        status
      });
      res.status(weeklyChart.statusCode).json({
        message: weeklyChart.message,
        data: weeklyChart.data,
        total: weeklyChart.total
      })
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  }
}
