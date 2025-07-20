import { Router } from 'express';
import { HealthController } from '../controllers/healthController';

const healthRoutes = Router();
const controller = new HealthController();

//rota /health do microserviço para monitorarmos a conexão com o RabbitMQ e o banco de dados (Prisma):

healthRoutes.get('/health', (req, res) => controller.check(req, res));

export { healthRoutes };