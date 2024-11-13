import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
import schedule from 'node-schedule';
import { UploadLogsToCloud } from '../controllers/upload/upload.controller';

function createLogFolder(folderName: string) {
    const logDir = path.join(__dirname, 'logs', folderName);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    return logDir;
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
        new winston.transports.Console(),
    ],
});

const registeredFolders = new Set<string>();

const logToFolder = (message: string, folderName: string) => {
    const logFolderPath = createLogFolder(folderName);
    const transport = new winston.transports.DailyRotateFile({
        filename: path.join(logFolderPath, 'Server-Logs-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
    });

    const folderLogger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
        ),
        transports: [transport],
    });

    folderLogger.info(message);

    if (!registeredFolders.has(folderName)) {
        registeredFolders.add(folderName);
    }
}

schedule.scheduleJob('59 23 * * *', () => {
    const today = new Date().toISOString().split('T')[0];
    registeredFolders.forEach((folderName) => {
        const logFolderPath = createLogFolder(folderName);
        const logFilePath = path.join(logFolderPath, `Server-Logs-${today}.log`);
        const destPath = `Server-Logs-${today}.log`;

        // Kiểm tra nếu file log tồn tại thì thực hiện upload
        if (fs.existsSync(logFilePath)) {
            UploadLogsToCloud(logFilePath, destPath, folderName);
            console.log(`Uploaded ${destPath} from folder ${folderName} to cloud at 23:59`);
        }
    });
});

export { logger, logToFolder };
