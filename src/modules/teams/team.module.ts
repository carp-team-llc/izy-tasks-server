
import express from "express";
import { TeamManagerService } from "../../services/teams/team.service";

const router = express.Router();
const teamService = new TeamManagerService();

// Team manager
router.post("/team_pagination", async(req, res) => {
  await teamService.TeamPagination(req, res);
})
router.post("/create_team", async(req, res) => {
  await teamService.CreateTeamService(req, res);
})
router.post("/update_team", async(req, res) => {
  await teamService.UpdateTeamService(req, res);
})
router.post("/delete_team", async(req, res) => {
  await teamService.DeleteTeamService(req, res);
})

export default router;