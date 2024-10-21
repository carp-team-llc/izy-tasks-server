import { Request, Response } from 'express';
import { ProjectTimline, TeamTimline } from '../../controllers/timeline/timeline.controller';

export class TimelineService {
  async TimelineTeam (req: Request, res: Response) {
    const { id } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const result = await TeamTimline(id, token);
    res.status(result.statusCode).json(result);
  }

  async TimelineProject (req: Request, res: Response) {
    const { id } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const result = await ProjectTimline(id, token);
    res.status(result.statusCode).json(result);
  }
}