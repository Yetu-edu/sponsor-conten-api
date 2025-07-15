import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'Token ausente' });

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
    req.user = { id: decoded.sub };
    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
}
