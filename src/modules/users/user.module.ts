import express from "express";
import { UserService } from "../../services/users/user.service";
import { DashboardService } from "../../services/users/dashboard.service";

const router = express.Router();
const userService = new UserService();
const dashboardService = new DashboardService();

// #region user manager
router.post("/create_profile", async (req, res) => {
  await userService.CreateProfileService(req, res);
});
// #endregion

// #region dashboard
router.post("/dashboard/infomation", async (req, res) => {
  await dashboardService.DashBoardInfomationService(req, res);
});

router.post("/dashboard/current", async (req, res) => {
  await dashboardService.CurrentTasksService(req, res);
});
// #endregion

export default router;
