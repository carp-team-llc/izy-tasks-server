
import { Request, Response } from "express";
import { CreateComments, DeleteComment, UpdateComment } from "../../controllers/comments/comments.controller";

export class CommentsService {
  async CreateComment (req: Request, res: Response) {
    try {
      const { content, taskId, userId } = req.body;
      const token = req.headers.authorization?.split(' ')[1];
      const result = await CreateComments({ content, taskId }, token);
      return res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error creating comment" });
    }
  }

  async UpdateComment (req: Request, res: Response) {
    try {
      const { id, content } = req.body;
      const result = await UpdateComment(id, content);
      return res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error updating comment" });
    }
  }

  async DeleteComment (req: Request, res: Response) {
    try {
      const { id } = req.body;
      const result = await DeleteComment(id);
      return res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error deleting comment" });
    }
  }
}