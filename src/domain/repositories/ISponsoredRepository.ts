import { SponsoredContent } from '@/domain/entities/Sponsored';
export interface ISponsorshipRepository {
  create(data: SponsoredContent): Promise<SponsoredContent>;
  findById(id: string): Promise<SponsoredContent | null>;
  findByType(type: SponsoredContent['type_content']): Promise<SponsoredContent[]>;
  listAll(): Promise<SponsoredContent[]>;
  updateDays(id: string, days: number, newEndDate: Date): Promise<SponsoredContent>;
  delete(id: string): Promise<void>;
  findExpired(currentDate: Date): Promise<SponsoredContent[]>;
  save(data: SponsoredContent): Promise<void>;
  findExpiringTomorrow(date: Date): Promise<SponsoredContent[]>;
}