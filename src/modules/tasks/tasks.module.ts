
import express from "express";
import { TasksService } from "../../services/tasks/tasks.service";
import { TaskStatusHandlers } from "../../services/tasks/taskStatusHandlers.service";
import { ChartService } from "../../services/tasks/chart.service";
import { TaskNotification } from "../../services/tasks/notification.service";
import { TaskListService } from "../../services/tasks/tasklist.service";
import { TaskHistoryService } from "../../services/tasks/taskHistory.service";

const router = express.Router();
const taskServices = new TasksService();
const taskStatusHandlers = new TaskStatusHandlers();
const chartServices = new ChartService();
const taskNotification = new TaskNotification();
const taskListServices = new TaskListService();
const taskHistoryService = new TaskHistoryService();

// #region Task Manager

router.post("/tasks_list", async (req, res) => {
    await taskServices.tasksPagination(req, res);
})

router.post("/task_detail", async (req, res) => {
    await taskServices.taskDetail(req, res);
})

router.post("/create_task", async (req, res) => {
    await taskServices.createTask(req, res);
})

router.post("/update_task", async (req, res) => {
    await taskServices.updateTask(req, res);
})

router.post("/delete_task", async (req, res) => {
    await taskServices.DeleteTask(req, res)
})

// #endregion

// #region Task Status

router.post("/update_task_status", async (req, res) => {
    await taskStatusHandlers.UpdateStatus(req, res)
})

router.post("/complete_task", async (req, res) => {
    await taskStatusHandlers.CompletedTask(req, res)
})
router.post("/cancel_task", async (req, res) => {
    await taskStatusHandlers.CancelTask(req, res)
})

router.post("/completed_task", async (req, res) => {
    await taskStatusHandlers.CompletedTask(req, res)
})

router.post("/doing_task", async (req, res) => {
    await taskStatusHandlers.DoingTask(req, res)
})

router.post("/late_task", async (req, res) => {
    await taskStatusHandlers.LateTask(req, res)
})

router.post("/new_task", async (req, res) => {
    await taskStatusHandlers.NewTask(req, res)
})

router.post("/pending_task", async (req, res) => {
    await taskStatusHandlers.PendingTask(req, res)
})

// #endregion

// #region Task Chart
router.post("/daily_chart", async (req, res) => {
    await chartServices.DailyChart(req, res)
})
router.post("/weekly_chart", async (req, res) => {
    await chartServices.WeeklyChart(req, res)
})
router.post("/monthly_chart", async (req, res) => {
    await chartServices.MonthlyChart(req, res)
})
// #endregion

// #region Task notification
router.post("/load_new_notification", async (req, res) => {
    await taskNotification.NotificationList(req, res)
})
// #endregion

// #region Task List
router.post("/task_list_pagination", async (req, res) => {
    await taskListServices.TaskListPaginationService(req, res)
})
router.post("/task_list_detail", async (req, res) => {
    await taskListServices.DetailTaskListService(req, res)
})
router.post("/create_task_list", async (req, res) => {
    await taskListServices.CreateTaskListService(req, res)
})
router.post("/update_task_list", async (req, res) => {
    await taskListServices.UpdateTaskListService(req, res)
})
router.post("/delete_task_list", async (req, res) => {
    await taskListServices.DeleteTaskListService(req, res)
})
router.post("/choose_task_list", async (req, res) => {
    await taskListServices.TaskList(req, res)
})
// #endregion

// #region task history
router.post("/task_activity", async (req, res) => {
    await taskHistoryService.TaskActivity(req, res)
})
// #endregion

export default router;