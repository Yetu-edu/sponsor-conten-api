// src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'error', // pode ser 'debug', 'warn', 'error', etc.
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // exibe no terminal
    new winston.transports.File({ filename: 'logs/app.log' })
  ],
});