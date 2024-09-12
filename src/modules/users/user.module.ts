import express from "express";
import { UserService } from "../../services/users/user.service";

const router = express.Router();
const userService = new UserService();

// #region user manager
  router.post("/create_profile", async(req, res) => {
    await userService.CreateProfileService(req, res);
  })
// #endregion

export default router;