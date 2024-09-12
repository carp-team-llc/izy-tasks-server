import { Request, Response } from "express";
import { DailyChart, WeeklyChart, MonthlyChart } from "../../controllers/tasks/TaskChart";

export class ChartService {
  async DailyChart(req: Request, res: Response) {
    try {
      const { createdAt, status } = req.body;
      const dailyChart = await DailyChart({
        createdAt,
        status,
      });
      return res.status(dailyChart.statusCode).json({
        message: dailyChart.message,
        data: dailyChart.data,
        total: dailyChart.total,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error!" });
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
      return res.status(weeklyChart.statusCode).json({
        message: weeklyChart.message,
        data: weeklyChart.data,
        total: weeklyChart.total
      })
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }

  async MonthlyChart(req: Request, res: Response) {
    try {
      const { status, month, } = req.body;
      const monthlyChart = await MonthlyChart({
        month,
        status
      });
      return res.status(monthlyChart.statusCode).json({
        message: monthlyChart.message,
        data: monthlyChart.data,
        total: monthlyChart.total
      })
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }
}
