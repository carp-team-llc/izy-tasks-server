
import { Request, Response } from "express";
import { ProjectDto, Variables } from "../../controllers/projects/dto/Project.dto";
import { ProjectPanigation } from "../../controllers/projects/ProjectManager";
import prisma from "../../utils/connection/connection";

export class ProjectService {

  async ProjectList (req: Request, res: Response) {
    try {
      const {
        where,
        skip,
        take
      }: Variables = req.body;
      const Projects = await ProjectPanigation({
        where: where,
        skip: skip,
        take: take
      });
      res.status(Projects.statusCode).json(Projects.data)
    } catch {
      res.status(500).json({message: "Internal Server Error!"})
    }
  }
  
}