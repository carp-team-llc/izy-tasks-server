import { Request, Response } from 'express';
import { ProjectTimline, TeamTimline } from '../../controllers/timeline/timeline.controller';

export class TimelineService {
  async TimelineTeam (req: Request, res: Response) {
    const { id } = req.body;
    const result = await TeamTimline(id);
    res.status(result.statusCode).json(result);
  }

  async TimelineProject (req: Request, res: Response) {
    const { id } = req.body;
    const result = await ProjectTimline(id);
    res.status(result.statusCode).json(result);
  }
}