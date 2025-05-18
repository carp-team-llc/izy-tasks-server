import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import moment from 'moment-timezone';
import cookieParser from "cookie-parser";

import authRouter from '../modules/auth/auth.module';
import taskModule from "../modules/tasks/tasks.module";
import projectModule from '../modules/projects/project.module';
import teamModule from '../modules/teams/team.module';
import userModule from "../modules/users/user.module";
import profileModule from '../modules/profile/profile.module';
import authMiddleware from '../utils/middleware/authentication/authMiddleware';
import mailSystemModule from '../modules/mail/mail.module';
import AccountMiddleware from '../utils/middleware/authentication/AccountMiddleware';
import SetupModule from "../modules/setup/setup.module"
import { upload } from '../utils/middleware/KeepFileMemory';
import uploadFileModule from "../modules/upload/upload.module"
import timelineModule from '../modules/timeline/time.module';
import commentsModule from '../modules/comments/comments.module';
import { logToFolder } from './logger';

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
    app.use(cookieParser());
    app.use(cors({
        origin: ["http://localhost:5173", "https://izytask.xyz"],
        credentials: true,
    }));
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
    api.use("/system/mailservice", mailSystemModule)
    api.use("/task", authMiddleware, AccountMiddleware, taskModule);
    api.use("/project", authMiddleware, AccountMiddleware, projectModule);
    api.use("/team", authMiddleware, AccountMiddleware, teamModule);
    api.use("/user", authMiddleware, AccountMiddleware, userModule);
    api.use("/user/profile", authMiddleware, AccountMiddleware, profileModule);
    api.use("/setup", authMiddleware, AccountMiddleware, SetupModule);
    api.use("/storage", authMiddleware, AccountMiddleware, upload.single('file'), uploadFileModule);
    api.use("/timeline", authMiddleware, AccountMiddleware, timelineModule);
    api.use("/comments", authMiddleware, AccountMiddleware, commentsModule);
};

export default initApi;
