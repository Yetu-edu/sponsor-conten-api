import cron from 'node-cron';
import { SponsorService } from "@/services/SponsoredService";

export function setupSponsorshipExpiration(service: SponsorService) {
  // Roda todos os dias à meia-noite
  cron.schedule('0 0 * * *', async () => {
    console.log('Verificando conteúdos expirados...');
    await service.expireOldSponsorships();
  });
}