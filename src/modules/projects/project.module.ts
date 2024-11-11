import express from "express";
import { ProjectService } from "../../services/projects/project.service";
import { ProjectInsightService } from "../../services/projects/projectInsight.service";
import { ProjectTaskService } from "../../services/projects/projectTask.service";

const router = express.Router();
const projectServices = new ProjectService();
const projectTaskServices = new ProjectTaskService();
const projectInsightServices = new ProjectInsightService();

// #region project manager
router.post("/project_list", async (req, res) => {
  await projectServices.ProjectList(req, res);
})
router.post("/project_detail", async (req, res) => {
  await projectServices.DetailProjectService(req, res);
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

router.post("/project_role", async (req, res) => {
  await projectServices.RoleListService(req, res);
})

// #endregion

// #region project task 
router.post("/create_task", async (req, res) => {
  await projectTaskServices.CreateProjectTask(req, res);
})
// #endregion

// #region insight
router.post("/top_insight", async (req, res) => {
  await projectInsightServices.TopInsightService(req, res);
})
router.post("/today_tasks", async (req, res) => {
  await projectInsightServices.TodayTasksService(req, res);
})
// #endregion

export default router;