import * as winston from 'winston';
import * as fs from 'fs-extra';
import * as path from 'path';

// Ensure logs directory exists
const logDir = 'reports';
fs.ensureDirSync(logDir);

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.printf(({ timestamp, level, message, stack }) => {
            return `${timestamp} - ${level.toUpperCase()} - ${message}${stack ? '\n' + stack : ''}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: path.join(logDir, 'test_logs.log'),
            level: 'info'
        })
    ]
});
