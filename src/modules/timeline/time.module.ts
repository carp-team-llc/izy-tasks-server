
import express from "express";
import { TimelineService } from "../../services/timeline/time.service";

const router = express.Router();
const timelineService = new TimelineService();

router.post("/timeline_team", async (req, res) => {
    await timelineService.TimelineTeam(req, res);
});

router.post("/timeline_project", async (req, res) => {
    await timelineService.TimelineProject(req, res);
});

export default router;