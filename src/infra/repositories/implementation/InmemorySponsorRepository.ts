import { SponsoredContentStatus } from '@prisma/client';
import { SponsoredContent } from '@/domain/entities/Sponsored';
import { ISponsoredContentRepository } from '@/domain/repositories/ISponsoredRepository';

export class InMemorySponsoredContentRepository implements ISponsoredContentRepository {
  private contents: SponsoredContent[] = [];

  async create(content: SponsoredContent): Promise<SponsoredContent> {
    this.contents.push(content);
    return content;
  }

  async findActiveByType(type: string): Promise<SponsoredContent[]> {
    const now = new Date();
    return this.contents.filter(content =>
      content.type === type &&
      content.status === SponsoredContentStatus.active &&
      content.end_date > now
    );
  }

  async findById(id: string): Promise<SponsoredContent | null> {
    return this.contents.find(content => content.id === id) ?? null;
  }

  async save(content: SponsoredContent): Promise<void> {
    const index = this.contents.findIndex(c => c.id === content.id);
    if (index >= 0) this.contents[index] = content;
  }
}