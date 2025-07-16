import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from "@/shared/errors/winston";


export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    logger.info('Aplicação iniciada');
    logger.error('Erro capturado:', err);

    if (err instanceof ZodError) {
        return res.status(400).json({
        message: 'Erro de validação',
        errors: err.issues,
    });}

  if (err.status && err.message) {
    return res.status(err.status).json({
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  return res.status(500).json({
    message: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}