import { SponsoredContent } from '@/domain/entities/Sponsored';

export interface ISponsoredContentRepository {
  create(content: SponsoredContent): Promise<SponsoredContent>;
  findActiveByType(type: string): Promise<SponsoredContent[]>;
  findById(id: string): Promise<SponsoredContent | null>;
  save(content: SponsoredContent): Promise<void>;
}