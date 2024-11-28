import express from 'express';
import { CommentsService } from '../../services/comments/comments.service';

const router = express.Router();
const commentsService = new CommentsService();

router.post("/create_comment", async (req, res) => {
  return await commentsService.CreateComment(req, res);
})

router.post("/update_comment", async (req, res) => {
  return await commentsService.UpdateComment(req, res);
})

router.post("/delete_comment", async (req, res) => {
  return await commentsService.DeleteComment(req, res);
})

export default router;