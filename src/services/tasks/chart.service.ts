import { Request, Response } from "express";
import { DailyChart, WeeklyChart, MonthlyChart } from "../../controllers/tasks/TaskChart";

export class ChartService {
  async DailyChart(req: Request, res: Response) {
    try {
      const { createdAt, status } = req.body;
      const token = req.headers['authorization'].split(' ')[1].replace('Bearer ', '');
      const dailyChart = await DailyChart({
        createdAt,
        status,
      }, token);
      return res.status(dailyChart.statusCode).json({
        message: dailyChart.message,
        data: dailyChart.data,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }

  async WeeklyChart(req: Request, res: Response) {
    try {
      const { fromDate, toDate, status } = req.body;
      const token = req.headers['authorization'].split(' ')[1].replace('Bearer ', '');
      const weeklyChart = await WeeklyChart({
        fromDate,
        toDate,
        status
      }, token);
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
      const token = req.headers['authorization'].split(' ')[1].replace('Bearer ', '');
      const monthlyChart = await MonthlyChart({
        month,
        status
      }, token);
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
