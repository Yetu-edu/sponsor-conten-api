import 'dotenv/config';
import { z } from 'zod';
import { AppError } from '../../shared/errors/error';

const schemaEnv = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
    PORT: z.coerce.number().default(4000),
    DATABASE_CLIENT: z.enum(["mysql", "pg", "sqlite"]).default("pg"),
    JWT_SECRET: z.string(),
    RABBITMQ_URL: z.string().url(),
    RABBITMQ_QUEUE_NAME: z.string(),
    RABBITMQ_EXCHANGE_NAME: z.string(),
    RABBITMQ_ROUTING_KEY: z.string(),
    RABBITMQ_CONSUMER_TAG: z.string(),

    RABBITMQ_PREFETCH_COUNT: z.coerce.number().default(1),
    RABBITMQ_RETRY_DELAY: z.coerce.number().default(5000),
    RABBITMQ_MAX_RETRIES: z.coerce.number().default(5),
    RABBITMQ_RETRY_QUEUE_NAME: z.string(),
    RABBITMQ_RETRY_EXCHANGE_NAME: z.string(),
    RABBITMQ_RETRY_ROUTING_KEY: z.string(),
    RABBITMQ_RETRY_CONSUMER_TAG: z.string(),
})

const _env = schemaEnv.safeParse(process.env)

if (_env.success == false){
    console.error('Variáveis de ambiente inválida❌', _env.error.format())

    throw new AppError('Variáveis de ambiente inválida❌')
}

export const env = _env.data