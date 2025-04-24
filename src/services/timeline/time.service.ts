import { Request, Response } from 'express';
import { ProjectTimline, TeamTimline } from '../../controllers/timeline/timeline.controller';
import { AuthGuard } from 'src/utils/middleware/authentication/AuthGuard';

export class TimelineService {
  async TimelineTeam (req: Request, res: Response) {
    const { id } = req.body;
    const token = AuthGuard(req);
    const result = await TeamTimline(id, token);
    res.status(result.statusCode).json(result);
  }

  async TimelineProject (req: Request, res: Response) {
    const { id } = req.body;
    const token = AuthGuard(req);
    const result = await ProjectTimline(id, token);
    res.status(result.statusCode).json(result);
  }
}