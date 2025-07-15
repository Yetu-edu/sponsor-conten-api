import { describe, it, expect, beforeEach } from 'vitest';
import { SponsoredService } from '@/services/SponsoredService';
import { InMemorySponsoredContentRepository } from '@/infra/repositories/implementation/InmemorySponsorRepository';
import { InMemorySubscriptionRepository } from '@/infra/repositories/implementation/InmemorySubscriptionRepository';
import { Subscription } from '@/domain/entities/Subscription';
import { SponsoredContentType, SponsoredContentStatus } from '@prisma/client';

  let sponsorRepository: InMemorySponsoredContentRepository;
  let subscriptionRepository: InMemorySubscriptionRepository;
  let service: SponsoredService;

describe('SponsoredService', () => {


  beforeEach(() => {
    sponsorRepository = new InMemorySponsoredContentRepository();
    subscriptionRepository = new InMemorySubscriptionRepository();
    service = new SponsoredService(sponsorRepository, subscriptionRepository);
  });

 it('deve criar conteúdo patrocinado se a assinatura estiver ativa', async () => {
    const user_id = 'user-1';
    const now = new Date();

    const subscription = new Subscription({
        user_id,
        plan: 'premium',
        status: 'active',
        created_at: now,
        expires_at: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        },);

    await subscriptionRepository.save(subscription);

    const result = await service.create({
      user_id,
      content: 'Conteúdo patrocinado',
      type: "badge"
    });

    expect(result).toBeTruthy();
    expect(result.content).toBe('Conteúdo patrocinado');
  });

  it('deve lançar erro se o usuário não tiver assinatura ativa', async () => {
 
    subscriptionRepository.findActiveByUserId("user-2");

    const dto = {
      user_id: 'user-2',
      type: SponsoredContentType.badge,
      content: 'Conteúdo sem assinatura',
      duration_in_days: 5
    };

    await expect(() => service.create(dto)).rejects.toThrow('Você precisa de uma assinatura ativa para criar conteúdo patrocinado.');
  });
});