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
import timeline from '../modules/timeline/time.module';
import Comments from '../modules/comments/comments.module';
import { logToFolder } from './logger';
import moment from 'moment-timezone';

const api = express.Router();

export function getClientIp(req: express.Request): string {
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;
    if (ip.includes('::ffff:')) {
        return ip.split('::ffff:')[1];
    }
    return ip;
}

const initApi = (app) => {

    app.set("json spaces", 2);
    app.use(cors());
    app.use(bodyParser.json());

    app.use((req, res, next) => {
        const ip = getClientIp(req);
        const now = moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");
        const message = `User IP: ${ip} - Method: ${req.method} - Endpoint: ${req.originalUrl}`;
        console.log(`[${now}] - User IP: ${ip} - Method: ${req.method} - Endpoint: ${req.originalUrl}`)
        logToFolder(message, "TrackingIp");
        next();
    });

    app.use("/api/v1", api);
    api.use("/auth", authRouter);
    api.use("/system/mailservice", mailSystemServices)
    api.use("/task", authMiddleware, AccountMiddleware, taskService);
    api.use("/project", authMiddleware, AccountMiddleware, projectServices);
    api.use("/team", authMiddleware, AccountMiddleware, teamServices);
    api.use("/user/profile", authMiddleware, AccountMiddleware, profileServices);
    api.use("/setup", authMiddleware, AccountMiddleware, SetupService);
    api.use("/storage", authMiddleware, AccountMiddleware, upload.single('file'), UploadFile);
    api.use("/timeline", authMiddleware, AccountMiddleware, timeline);
    api.use("/comments", authMiddleware, AccountMiddleware, Comments);
};

export default initApi;
