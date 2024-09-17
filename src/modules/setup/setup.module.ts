import express from "express"
import { ProjectSetup } from "../../services/setup/setup.service"

const router = express.Router();
const projectSetup = new ProjectSetup()

// #region Task setup
router.post("/load_status_list", async (req, res) => {
  await projectSetup.LoadStatusList(req, res)
})
router.post("/load_priority_list", async (req, res) => {
  await projectSetup.LoadPriorityList(req, res)
})
router.post("/load_project_role", async (req, res) => {
  await projectSetup.LoadProjectRole(req, res)
})
// #endregion

export default router;