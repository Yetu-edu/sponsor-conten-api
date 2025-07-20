import amqplib from 'amqplib';
import { env } from '@/config/env/index';
import { AppError } from '../errors/error';
import { logger } from '@/shared/errors/winston';

let connection: amqplib.Connection | null = null;

// Declara uma variável global `channel` para armazenar o canal de comunicação com o RabbitMQ
let channel: amqplib.Channel;

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

export async function connectRabbitMQ(retries = MAX_RETRIES) {
  try {
      // Estabelece a conexão com o RabbitMQ usando a URL definida nas variáveis de ambiente
    logger.info('📡 Conectando ao RabbitMQ...');
    const connection = await amqplib.connect(env.RABBITMQ_URL);

    // Cria um canal de comunicação (por onde as mensagens serão enviadas e recebidas)
    channel = await connection.createChannel();

    // Declara (ou garante que existe) um Exchange do tipo 'direct' com o nome especificado
    // Exchanges roteiam mensagens para as filas com base em uma chave (routing key)
    await channel.assertExchange(env.RABBITMQ_EXCHANGE_NAME, 'direct', { durable: true });

    // Declara (ou garante que existe) uma fila com o nome especificado, que é persistente (durable)
    await channel.assertQueue(env.RABBITMQ_QUEUE_NAME, {
      durable: true,
      deadLetterExchange: env.RABBITMQ_EXCHANGE_NAME, // volta para a exchange principal
      messageTtl: env.RABBITMQ_RETRY_DELAY, // tempo de vida da mensagem antes de retornar
      });

    // Faz o "bind" da fila ao exchange, usando a routing key
    // Isso significa que quando uma mensagem for publicada nesse exchange com essa routing key,
    // ela será entregue a essa fila.
    await channel.bindQueue(
      env.RABBITMQ_QUEUE_NAME, 
      env.RABBITMQ_EXCHANGE_NAME, 
      env.RABBITMQ_ROUTING_KEY
    );

    // Define a quantidade de mensagens que o consumidor pode processar por vez
    // Aqui está limitado a `RABBITMQ_PREFETCH_COUNT` mensagens simultâneas (1 por padrão)
    channel.prefetch(env.RABBITMQ_PREFETCH_COUNT);

    logger.info('✅ Conexão com RabbitMQ estabelecida com sucesso!');

    // Escuta eventos de erro e reconecta se necessário
    connection.on('error', (err) => {
      logger.error('💥 Erro na conexão com o RabbitMQ:', err);
      connectRabbitMQ();
    });
    connection.on('close', () => {
      logger.warn('🔌 Conexão com RabbitMQ fechada, tentando reconectar...');
      connectRabbitMQ();
    });

  } catch (err) {
    logger.error(`❌ Erro ao conectar ao RabbitMQ: ${err}`);

    if (retries > 0) {
      logger.warn(`🔁 Tentando reconectar ao RabbitMQ em ${RETRY_DELAY_MS / 1000}s... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      setTimeout(() => connectRabbitMQ(retries - 1), RETRY_DELAY_MS);
    } else {
      logger.error('🚫 Número máximo de tentativas de conexão ao RabbitMQ excedido.');
    }
  }
}

function reconnectRabbitMQ() {
  connection = null;
  channel = null!;
  connectRabbitMQ();
}


export function getRabbitChannel(): amqplib.Channel {
    // Verifica se o canal foi inicializado
  // Se não foi, lança um erro para evitar que código abaixo tente usá-lo de forma inválida
  if (!channel) throw new AppError('Canal RabbitMQ não inicializado');

  // Retorna o canal para ser utilizado em outras partes do código
  return channel;
}

export async function publishEvent(queue: string, message: any) {
    // Obtém o canal ativo (ou lança erro se não estiver conectado)
  const ch = getRabbitChannel();

  // Envia a mensagem para a fila especificada
  // A mensagem é convertida para buffer (como o RabbitMQ espera)
  // A opção `persistent: true` garante que a mensagem será salva no disco (não apenas na memória)
  await ch.assertQueue(queue, { durable: true });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
}

export async function retryEvent(message: any) {
  const ch = getRabbitChannel();
  await ch.assertQueue(env.RABBITMQ_RETRY_QUEUE_NAME, { durable: true });

  ch.sendToQueue(env.RABBITMQ_RETRY_QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  logger.warn('⏳ Mensagem enviada para fila de retry');
}