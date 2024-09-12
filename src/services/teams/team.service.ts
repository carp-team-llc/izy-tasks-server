import { Request, Response } from "express";
import { CreateTeam, DeleteTeam, UpdateTeam } from "../../controllers/teams/TeamManager";

export class TeamManagerService {
  async CreateTeamService(req: Request, res: Response) {
    try {
      const { name, bio, address, phonenumber, email, avatar, member } = req.body;
      const createTeam = await CreateTeam({
        name,
        bio,
        address,
        phonenumber,
        email,
        avatar,
        member,
      });
      return res.status(createTeam.statusCode).json({
        message: createTeam.message,
        data: createTeam.data,
      });
    } catch {
      return res.status(500).send({ message: "Error creating team" });
    }
  }
  async UpdateTeamService(req: Request, res: Response) {
    try {
      const { id, name, bio, address, phonenumber, email, avatar, member } =
        req.body;
      const updateTeam = await UpdateTeam({
        id,
        name,
        bio,
        address,
        phonenumber,
        email,
        avatar,
        member,
      });
      return res.status(updateTeam.statusCode).json({
        message: updateTeam.message,
        data: updateTeam.data,
      });
    } catch {
      return res.status(500).send({ message: "Error updating team" });
    }
  }

  async DeleteTeamService(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const deleteTeam = await DeleteTeam({
        id
      })
      return res.status(deleteTeam.statusCode).json({
        message: deleteTeam.message,
        data: deleteTeam.data,
      });
    } catch {
      return res.status(500).send({ message: "Error delete team" });
    }
  }
}
