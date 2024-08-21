import express from "express";
import { ProjectService } from "../../services/projects/project.service";

const router = express.Router();
const projectServices = new ProjectService();

// #region project manager
router.post("/project_list", async (req, res) => {
  await projectServices.ProjectList(req, res);
})
// #endregion

export default router;