import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRouter from '../modules/auth/auth.module';
import taskService from "../modules/tasks/tasks.module";
import projectServices from '../modules/projects/project.module';
import teamServices from '../modules/teams/team.module';
import userServices from '../modules/users/user.module';

const api = express.Router();

const initApi = (app) => {
    app.set("json spaces", 2);
    app.use(cors());
    app.use(bodyParser.json());
    app.use("/api/v1", api);
    api.use('/auth', authRouter);
    api.use("/task", taskService);
    api.use("/project", projectServices);
    api.use("/team", teamServices)
    api.use("/user", userServices)
};

export default initApi;
