import cron from 'node-cron';
import { SponsorService } from "@/services/SponsoredService";
import { logger } from "@/shared/errors/winston";

//Esse cron job está sendo usado para verificar diariamente se há conteúdos patrocinados expirados e marcá-los como tal.
//Ele roda todos os dias à meia-noite.

//Isso garante que todos os patrocínios vencidos até aquele momento sejam identificados e atualizados no banco

export function setupSponsorshipExpiration(service: SponsorService) {
  cron.schedule('0 0 * * *', async () => {
    const now = new Date().toISOString();

    logger.info(`[${now}] Iniciando verificação de conteúdos expirados...`);

    try {
      await service.expireOldSponsorships();
      logger.info(`[${now}] Verificação concluída com sucesso.`);
    } catch (error) {
      logger.error(`[${now}] Erro ao verificar conteúdos expirados: ${(error as Error).message}`);
    }
  });
}