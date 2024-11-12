import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
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

    // Upload logs to Cloud Storage after 24 hours
    const logFilePath = path.join(logFolderPath, 'Server-Logs-' + new Date().toISOString().split('T')[0] + '.log');
    const destPath = `Server-Logs-${new Date().toISOString().split('T')[0]}.log`;
    UploadLogsToCloud(logFilePath, destPath, folderName);
}

export { logger, logToFolder };
