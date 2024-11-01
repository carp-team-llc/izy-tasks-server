
import { Request, Response } from "express";
import { CancelTask, CompletedTask, DoingTask, LateTask, NewTask, PendingTask, UpdateTaskStatus } from "../../controllers/tasks/taskStatusHandlers";

export class TaskStatusHandlers {

  async UpdateStatus(req: Request, res: Response) {
    try {
      const { id, statusKey } = req.body;
      const result = await UpdateTaskStatus({ id, statusKey });
      return res.status(result.statusCode).json(result);
    } catch (error) {
      console.error("Error: ", error);
      return res.status(500).json({message: "Internal Server Error!"})
    }
  } 
  
  async CancelTask (req: Request, res: Response) {
    try {
      const { id } = req.body;
      const result = await CancelTask({ id });
      return res.json(result);
    } catch (error) {
      console.error("Error: ", error);
      return res.status(500).json({message: "Internal Server Error!"})
    }
  }

  async CompletedTask (req: Request, res: Response) {
    try {
      const { id } = req.body;
      const result = await CompletedTask({ id });
      return res.json(result);
    } catch (error) {
      console.error("Error: ", error);
      return res.status(500).json({message: "Internal Server Error!"})
    }
  }

  async DoingTask (req: Request, res: Response) {
    try {
      const { id } = req.body;
      const result = await DoingTask({ id });
      return res.json(result);
    } catch (error) {
      console.error("Error: ", error);
      return res.status(500).json({message: "Internal Server Error!"})
    }
  }

  async LateTask (req: Request, res: Response) {
    try {
      const { id } = req.body;
      const result = await LateTask({ id });
      return res.json(result);
    } catch (error) {
      console.error("Error: ", error);
      return res.status(500).json({message: "Internal Server Error!"})
    }
  }

  async NewTask (req: Request, res: Response) {
    try{
      const { id } = req.body;
      const result = await NewTask({ id });
      return res.json(result);
    } catch (error) {
      console.error("Error: ", error);
      return res.status(500).json({message: "Internal Server Error!"})
    }
  }
  
  async PendingTask (req: Request, res: Response) {
    try {
      const { id } = req.body;
      const result = await PendingTask({ id });
      return res.json(result);
    } catch (error) {
      console.error("Error: ", error);
      return res.status(500).json({message: "Internal Server Error!"})
    }
  }
}