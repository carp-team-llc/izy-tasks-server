import express from "express";
import { ProjectService } from "../../services/projects/project.service";

const router = express.Router();
const projectServices = new ProjectService();

// #region project manager
router.post("/project_list", async (req, res) => {
  await projectServices.ProjectList(req, res);
})
router.post("/create_project", async (req, res) => {
  await projectServices.CreateProjectService(req, res);
})
router.post("/update_project", async (req, res) => {
  await projectServices.UpdateProjectServices(req, res);
})
router.post("/delete_project", async (req, res) => {
  await projectServices.DeleteProjectServices(req, res);
})
// #endregion

// #region project management

router.post("/add_task_project", async (req, res) => {
  await projectServices.AddTaskServices(req, res);
})

// #endregion

export default router;