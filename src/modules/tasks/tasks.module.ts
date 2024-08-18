
import express from "express";
import { TasksService } from "../../services/tasks/tasks.service";
import { TaskStatusHandlers } from "../../services/tasks/taskStatusHandlers.service";

const router = express.Router();
const taskServices = new TasksService();
const taskStatusHandlers = new TaskStatusHandlers();

// #region Task Manager

router.post("/tasks_list", async (req, res) => {
    await taskServices.tasksPagination(req, res);
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
router.post("/cancel_task", async (req, res) => {
    await taskStatusHandlers.CancelTask(req, res)
})

router.post("/completed_task", async (req, res) => {
    await taskStatusHandlers.CompletedTask(req, res)
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

export default router;