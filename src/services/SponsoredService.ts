import { CreateSponsoredContentDTO } from '@/interfaces/dtos/sponsoredDto';
import { SponsoredContent } from '@/domain/entities/Sponsored';
import { ISponsoredContentRepository } from '@/domain/repositories/ISponsoredRepository';
import { ObjectId } from 'bson'; 
import { UnauthorizedError } from '@/shared/errors/error';
import { ISubscriptionRepository } from '@/domain/repositories/ISubscriptionRepository';

export class SponsoredService {
  constructor(
      private sponsorRepository: ISponsoredContentRepository,
      private subscriptionRepository: ISubscriptionRepository
    ) {}

  async create(data: CreateSponsoredContentDTO) {

    const subscription = await this.subscriptionRepository.findActiveByUserId(data.user_id);

    if (!subscription) {
       throw new UnauthorizedError('Você precisa de uma assinatura ativa para criar conteúdo patrocinado.');
    }

    const duration = data.duration_in_days ?? 30;
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

    const content = new SponsoredContent(
      new ObjectId().toHexString(),
      data.user_id,
      data.type,
      data.content,
      startDate,
      endDate,
      'active'
    );

    return await this.sponsorRepository.create(content);
  }

  async getActiveContents(type: string): Promise<SponsoredContent[]> {
    return this.sponsorRepository.findActiveByType(type);
  }
}