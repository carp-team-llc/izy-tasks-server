import express from "express";
import { ProjectService } from "../../services/projects/project.service";
import { ProjectInsightService } from "../../services/projects/projectInsight.service";
import { ProjectTaskService } from "../../services/projects/projectTask.service";
import { ProjectAnalyticsService } from '../../services/projects/projectAnalytics.service';
import { ProjectMemberService } from "../../services/projects/projectMember.service";

const router = express.Router();
const projectServices = new ProjectService();
const projectTaskServices = new ProjectTaskService();
const projectInsightServices = new ProjectInsightService();
const projectAnalyticsService = new ProjectAnalyticsService();
const projectMemberService = new ProjectMemberService();

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

// #region project analytics
router.post("/activate_project", async (req, res) => {
  await projectAnalyticsService.ProjectActivate(req, res);
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
router.post("/update_task", async (req, res) => {
  await projectTaskServices.UpdateProjectTask(req, res);
})
router.post("/change_status", async (req, res) => {
  await projectTaskServices.ChangeStatusTask(req, res);
})
// #endregion

// #region insight
router.post("/top_insight", async (req, res) => {
  await projectInsightServices.TopInsightService(req, res);
})
router.post("/today_tasks", async (req, res) => {
  await projectInsightServices.TodayTasksService(req, res);
})
router.post("/total_tasks_chart", async (req, res) => {
  await projectInsightServices.TotalChartService(req, res);
})
router.post("/project_workload", async (req, res) => {
  await projectInsightServices.ProjectWorkloadService(req, res);
});
// #endregion

// #region members
router.post("/members", async (req, res) => {
  await projectMemberService.ProjectMemberList(req, res);
})
// #endregion

export default router;