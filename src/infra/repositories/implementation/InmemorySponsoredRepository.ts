import { ISponsorshipRepository } from '@/domain/repositories/ISponsoredRepository';
import { SponsoredContent } from '@/domain/entities/Sponsored';

export class InMemorySponsoredContentRepository implements ISponsorshipRepository {
  private items: SponsoredContent[] = [];

  async create(data: SponsoredContent): Promise<SponsoredContent> {
    this.items.push(data);
    return data;
  }

  async findById(id: string): Promise<SponsoredContent | null> {
    const item = this.items.find(item => item.getId() === id);
    return item ?? null;
  }

  async findByType(type: SponsoredContent['type_content']): Promise<SponsoredContent[]> {
    return this.items.filter(item => item.getType() === type);
  }

  async listAll(): Promise<SponsoredContent[]> {
    return [...this.items];
  }

  async updateDays(id: string, days: number, newEndDate: Date): Promise<void> {
    const item = this.items.find(item => item.getId() === id);
    if (item) {
      (item as any).days = days;
      (item as any).end_date = newEndDate;
      (item as any).updated_at = new Date();
    }
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter(item => item.getId() !== id);
  }

  async findExpired(currentDate: Date): Promise<SponsoredContent[]> {
    return this.items.filter(item => item.getEndDate() < currentDate);
  }

  async save(data: SponsoredContent): Promise<void> {
    const index = this.items.findIndex(item => item.getId() === data.getId());

    if (index !== -1) {
      this.items[index] = data;
    } else {
      this.items.push(data);
    }
  }
}