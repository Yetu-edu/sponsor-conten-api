import { Request, Response } from 'express';
import { getRabbitChannel } from '@/shared/message-broker/rabbit';
import { prisma } from '@/infra/database/prisma';

export class HealthController {
  async check(request: Request, response: Response) {
    const status: Record<string, string> = {};

    // Verifica RabbitMQ
    try {
      const channel = getRabbitChannel();
      await channel.checkQueue(process.env.RABBITMQ_QUEUE_NAME!);
      status.rabbitmq = 'ok';
    } catch {
      status.rabbitmq = 'fail';
    }

    // Verifica banco de dados
    try {
      await prisma.$queryRaw`SELECT 1`;
      status.database = 'ok';
    } catch {
      status.database = 'fail';
    }

    const overall = Object.values(status).every(v => v === 'ok') ? 'ok' : 'fail';
    return response.status(overall === 'ok' ? 200 : 500).json({ status: overall, details: status });
  }
}