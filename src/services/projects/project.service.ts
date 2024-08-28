import { Request, Response } from "express";
import {
  ProjectDto,
  Variables,
} from "../../controllers/projects/dto/Project.dto";
import {
  CreateProject,
  DeleteProject,
  ProjectPanigation,
  UpdateProject,
} from "../../controllers/projects/ProjectManager";
import { AddTask } from "../../controllers/projects/ProjectManagement";

export class ProjectService {
  // #region project manager

  async ProjectList(req: Request, res: Response) {
    try {
      const { where, skip, take }: Variables = req.body;
      const Projects = await ProjectPanigation({
        where: where,
        skip: skip,
        take: take,
      });
      res.status(Projects.statusCode).json(Projects.data);
    } catch {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  }

  async CreateProjectService(req: Request, res: Response) {
    try {
      const { name, description, member, tasks, avatar, deadline }: ProjectDto =
        req.body;
      const createProject = await CreateProject({
        name: name,
        description: description,
        member: member,
        tasks: tasks,
        avatar: avatar,
        deadline: deadline,
      });
      res.json(createProject);
    } catch {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  }

  async UpdateProjectServices(req: Request, res: Response) {
    try {
      const {
        id,
        name,
        description,
        member,
        tasks,
        avatar,
        deadline,
      }: ProjectDto = req.body;
      const updateProject = await UpdateProject({
        id,
        name,
        description,
        member,
        tasks,
        avatar,
        deadline,
      });
      res.json(updateProject);
    } catch {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  }

  async DeleteProjectServices(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const deleteProject = await DeleteProject(id);
      res.json(deleteProject);
    } catch {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  }

  // #endregion

  // #region project manageent

  async AddTaskServices(req: Request, res: Response) {
    try {
      const { projectId, taskId } = req.body;
      const addTask = await AddTask({ projectId, taskId });
      res.json(addTask);
    } catch {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  }

  // #endregion
}
