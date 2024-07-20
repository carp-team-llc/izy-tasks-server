
import express from "express";
import { TasksService } from "../../services/tasks/tasks.service";

const router = express.Router();
const taskServices = new TasksService();

router.post("/tasks_list", async (req, res) => {
    await taskServices.tasksPagination(req, res);
})

router.post("/create_task", async (req, res) => {
    await taskServices.createTask(req, res);
})

router.post("/update_task", async (req, res) => {
    await taskServices.updateTask(req, res);
})

export default router;