import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRouter from '../modules/auth/auth.module';
import taskService from "../modules/tasks/tasks.module";
import projectServices from '../modules/projects/project.module';
import teamServices from '../modules/teams/team.module';
import userServices from '../modules/users/user.module';
import authMiddleware from '../utils/middleware/authentication/authMiddleware';
import mailSystemServices from '../modules/mail/mail.module';

const api = express.Router();

const initApi = (app) => {
    app.set("json spaces", 2);
    app.use(cors());
    app.use(bodyParser.json());
    app.use("/api/v1", api);
    api.use('/auth', authRouter);
    api.use('/system/mailservice', mailSystemServices)
    api.use("/task", authMiddleware, taskService);
    api.use("/project", authMiddleware, projectServices);
    api.use("/team", authMiddleware, teamServices);
    api.use("/user", authMiddleware, userServices);
};

export default initApi;
