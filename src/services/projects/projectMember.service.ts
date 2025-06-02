import type { Request, Response } from "express";
import { addMember, checkUserRole, ShowMembersList } from "../../controllers/projects/ProjectMember";
import { AuthGuard } from "../../utils/middleware/authentication/AuthGuard";

export class ProjectMemberService {

  async CheckUserRole(req: Request, res: Response) {
    try {
      const { projectId } = req.body;
      const token = AuthGuard(req);
      const role = await checkUserRole(projectId, token);
      res.status(role.statusCode).json({
        message: role.message,
        data: role.data
      });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async ProjectMemberList(req: Request, res: Response) {
    try {
      const { projectId } = req.body;
      const token = AuthGuard(req)
      const projectMembers = await ShowMembersList(projectId, token);
      res.status(projectMembers.statusCode).json({
        message: projectMembers.message,
        data: projectMembers.data
      });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async AddProjectMember(req: Request, res: Response) {
    try {
      const { projectId, userId } = req.body;
      const token = AuthGuard(req)
      const add = await addMember(projectId, userId, token);
      res.status(add.statusCode).json({
        message: add.message,
        data: add.data
      });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}