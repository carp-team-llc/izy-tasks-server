
import { Request, Response } from "express";
import { LoadPriority, LoadProjecRole, LoadStatusList } from "../../controllers/setup/ProjectSetup";

export class ProjectSetup {
  async LoadStatusList (req: Request, res: Response) {
    try {
        const result = await LoadStatusList()
        return res.status(result.statusCode).json({
            StatusList: result.StatusList,
        })
    } catch (err) {
        return res.status(500).json({message: "Internal Server Error!"})
    }
}

async LoadPriorityList (req: Request, res: Response) {
    try {
        const result = await LoadPriority()
        return res.status(result.statusCode).json({
            PriorityList: result.PriorityList,
        })
    } catch (err) {
        return res.status(500).json({message: "Internal Server Error!"})
    }
}

async LoadProjectRole (req: Request, res: Response) {
    try {
        const result = await LoadProjecRole()
        return res.status(result.statusCode).json({
            ProjectRole: result.ProjectRole,
        })
    } catch (err) {
        return res.status(500).json({message: "Internal Server Error!"})
    }
}
}