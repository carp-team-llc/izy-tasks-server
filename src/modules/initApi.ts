import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRouter from '../modules/auth/auth.module';
import taskService from "../modules/tasks/tasks.module";
import projectServices from '../modules/projects/project.module';
import teamServices from '../modules/teams/team.module';
import profileServices from '../modules/profile/profile.module';
import authMiddleware from '../utils/middleware/authentication/authMiddleware';
import mailSystemServices from '../modules/mail/mail.module';
import AccountMiddleware from '../utils/middleware/authentication/AccountMiddleware';
import SetupService from "../modules/setup/setup.module"
import { upload } from '../utils/middleware/KeepFileMemory';
import UploadFile from "../modules/upload/upload.module"

const api = express.Router();

const initApi = (app) => {

    app.set("json spaces", 2);
    app.use(cors());
    app.use(bodyParser.json());
    app.use("/api/v1", api);
    api.use('/auth', authRouter);
    api.use('/system/mailservice', mailSystemServices)
    api.use("/task", authMiddleware, AccountMiddleware, taskService);
    api.use("/project", authMiddleware, AccountMiddleware, projectServices);
    api.use("/team", authMiddleware, AccountMiddleware, teamServices);
    api.use("/user/profile", authMiddleware, AccountMiddleware, profileServices);
    api.use("/setup", authMiddleware, AccountMiddleware, SetupService);
    api.use("/storage", authMiddleware, AccountMiddleware, upload.single('file'), UploadFile);
};

export default initApi;
