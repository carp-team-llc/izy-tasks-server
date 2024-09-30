import express from "express";
import { ProfileService } from "../../services/profile/Profile.service";

const router = express.Router();
const profileService = new ProfileService();

// #region user manager
  router.post("/create_profile", async(req, res) => {
    await profileService.CreateProfileService(req, res);
  })
  router.post("/update_profile", async(req, res) => {
    await profileService.UpdateProfileService(req, res);
  })
  router.post("/delete_profile", async(req, res) => {
    await profileService.DeleteProfileService(req, res);
  })
  router.post("/profile_detail", async(req, res) => {
    await profileService.ProfileDetailService(req, res);
  })
// #endregion

export default router;