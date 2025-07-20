import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import cookieParser from 'cookie-parser';
import {errorHandler } from "./shared/errors/errorHandler";
import { makeSponsoredContentService } from "@/interfaces/factories/sponsoredFactory";
import { setupSponsorshipExpiration } from "@/shared/utils/sponsorCon";
import { connectRabbitMQ } from '@/shared/message-broker/rabbit';

//Rotas
import { sponsoredContentRoutes } from '@/interfaces/routes/sponsored.routes';
import { verificationSealRoutes } from '@/interfaces/routes/verificationSeal.routes';
import { authRouter } from "@/interfaces/routes/user.routes";
import { healthRoutes } from '@/interfaces/routes/health.routes';

export const app = express();

// Ativa o CORS para todas as origens
app.use(cors());

// Ou com configuração personalizada
// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// }));
app.use(express.json());
app.use(cookieParser())
app.use('/api/v1', sponsoredContentRoutes);
app.use('/api/v1', verificationSealRoutes)
app.use('/api/v1/auth', authRouter);
app.use('/api/v1', healthRoutes);

// Swagger disponível em /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);

// Ativa o cron job
const sponsorService = makeSponsoredContentService();
setupSponsorshipExpiration(sponsorService);

(async () => {
  await connectRabbitMQ();
  const sponsorService = makeSponsoredContentService();
  setupSponsorshipExpiration(sponsorService);
})();