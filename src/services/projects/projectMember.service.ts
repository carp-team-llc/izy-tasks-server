import type { Request, Response } from "express";
import { ShowMebesList } from "../../controllers/projects/ProjectMember";
import { AuthGuard } from "../../utils/middleware/authentication/AuthGuard";

export class ProjectMemberService {
  async ProjectMemberList(req: Request, res: Response) {
    try {
      const { projectId } = req.body;
      const token = AuthGuard(req)
      const projectMembers = await ShowMebesList(projectId, token);
      res.status(projectMembers.statusCode).json({
        message: projectMembers.message,
        data: projectMembers.data
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}