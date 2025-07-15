import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import cookieParser from 'cookie-parser';

//Rotas
import { sponsoredContentRoutes } from '@/interfaces/routes/sponsored.routes';
import { subscriptionRoutes } from "@/interfaces/routes/subscription.routes";

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
app.use('/api/v1', subscriptionRoutes)

// Swagger disponível em /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));