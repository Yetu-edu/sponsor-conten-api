import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import cookieParser from 'cookie-parser';
import {errorHandler } from "./shared/errors/errorHandler";

//Rotas
import { sponsoredContentRoutes } from '@/interfaces/routes/sponsored.routes';
import { verificationSealRoutes } from '@/interfaces/routes/verificationSeal.routes';

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

// Swagger disponível em /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);