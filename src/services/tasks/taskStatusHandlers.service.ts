
import { Request, Response } from "express";
import { CancelTask, CompletedTask, LateTask, NewTask, PendingTask } from "../../controllers/tasks/taskStatusHandlers";

export class TaskStatusHandlers {
  
  async CancelTask (req: Request, res: Response) {
    try {
      const { id } = req.body;
      const result = await CancelTask({ id });
      res.status(result.statusCode).json(result.message)
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({message: "Internal Server Error!"})
    }
  }

  async CompletedTask (req: Request, res: Response) {
    try {
      const { id } = req.body;
      const result = await CompletedTask({ id });
      res.status(result.statusCode).json(result.message);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({message: "Internal Server Error!"})
    }
  }

  async LateTask (req: Request, res: Response) {
    try {
      const { id } = req.body;
      const result = await LateTask({ id });
      res.status(result.statusCode).json(result.message);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({message: "Internal Server Error!"})
    }
  }

  async NewTask (req: Request, res: Response) {
    try{
      const { id } = req.body;
      const result = await NewTask({ id });
      res.status(result.statusCode).json(result.message);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({message: "Internal Server Error!"})
    }
  }
  
  async PendingTask (req: Request, res: Response) {
    try {
      const { id } = req.body;
      const result = await PendingTask({ id });
      res.status(result.statusCode).json(result.statusCode);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({message: "Internal Server Error!"})
    }
  }
}