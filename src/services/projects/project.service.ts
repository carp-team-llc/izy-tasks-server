import { Request, Response } from "express";
import {
  ProjectDto,
  Variables,
} from "../../controllers/projects/dto/Project.dto";
import {
  CreateProject,
  DeleteProject,
  DetailProject,
  ProjectPanigation,
  UpdateProject,
} from "../../controllers/projects/ProjectManager";
import {
  AddTask,
  RoleList,
} from "../../controllers/projects/ProjectManagement";

export class ProjectService {
  // #region project manager

  async ProjectList(req: Request, res: Response) {
    try {
      const { where, skip, take }: Variables = req.body;
      const token = req.headers["authorization"]
        .split(" ")[1]
        .replace("Bearer ", "");
      const Projects = await ProjectPanigation({
        where: where,
        skip: skip,
        take: take,
      }, token);
      return res.status(Projects.statusCode).json(Projects.data);
    } catch {
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }

  async DetailProjectService(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const token = req.headers["authorization"]
        .split(" ")[1]
        .replace("Bearer ", "");
      const project = await DetailProject(id, token);
      return res.status(project.statusCode).json(project.data);
    } catch {
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }

  async CreateProjectService(req: Request, res: Response) {
    try {
      const {
        name,
        description,
        member,
        tasks,
        avatar,
        startTime,
        deadline,
        teamId,
        permission,
        timeworking,
      }: ProjectDto = req.body;
      const token = req.headers["authorization"]
        .split(" ")[1]
        .replace("Bearer ", "");
      const createProject = await CreateProject(
        {
          name: name,
          description: description,
          member: member,
          permission: permission,
          timeworking: timeworking,
          teamId: teamId,
          tasks: tasks,
          avatar: avatar,
          startTime: startTime,
          deadline: deadline,
        },
        token
      );
      return res.json(createProject);
    } catch {
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }

  async UpdateProjectServices(req: Request, res: Response) {
    try {
      const {
        id,
        name,
        description,
        permission,
        timeworking,
        member,
        tasks,
        teamId,
        avatar,
        startTime,
        deadline,
      }: ProjectDto = req.body;
      const token = req.headers["authorization"]
        .split(" ")[1]
        .replace("Bearer ", "");
      const updateProject = await UpdateProject(
        {
          id,
          name,
          description,
          timeworking,
          permission,
          member,
          tasks,
          teamId,
          avatar,
          startTime,
          deadline,
        },
        token
      );
      return res.json(updateProject);
    } catch {
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }

  async DeleteProjectServices(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const token = req.headers["authorization"]
        .split(" ")[1]
        .replace("Bearer ", "");
      const deleteProject = await DeleteProject(id, token);
      return res.json(deleteProject);
    } catch {
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }

  // #endregion

  // #region project manageent

  async AddTaskServices(req: Request, res: Response) {
    try {
      const { projectId, taskId } = req.body;
      const addTask = await AddTask({ projectId, taskId });
      return res.json(addTask);
    } catch {
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }

  async RoleListService(req: Request, res: Response) {
    try {
      const showRole = RoleList();
      return res.status(showRole.statusCode).json({
        message: showRole.message,
        data: showRole.data,
      });
    } catch {
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  }

  // #endregion
}
