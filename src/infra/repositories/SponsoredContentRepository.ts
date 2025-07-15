import { prisma } from '@/infra/database/prisma';
import { SponsoredContentType, SponsoredContentStatus } from '@prisma/client';
import { SponsoredContent } from '@/domain/entities/Sponsored';
import { ISponsoredContentRepository } from '@/domain/repositories/ISponsoredRepository';
import { SponsoredContentMapper } from '@/infra/mappers/SponsoredMapper';

export class MongooseSponsoredContentRepository implements ISponsoredContentRepository {
  private connector = prisma;

  async create(content: SponsoredContent): Promise<SponsoredContent> {
    const data = SponsoredContentMapper.toPersistence(content);
    const created = await this.connector.sponsoredContent.create({ data });
    return SponsoredContentMapper.toDomain(created);
  }

  async findActiveByType(type: string): Promise<SponsoredContent[]> {
    const enumType = type as SponsoredContentType;

    const results = await this.connector.sponsoredContent.findMany({
      where: {
        type: enumType,
        status: SponsoredContentStatus.active,
        end_date: { gt: new Date() }
      },
    });
    return results.map(SponsoredContentMapper.toDomain);
  }

  async findById(id: string): Promise<SponsoredContent | null> {
    const result = await this.connector.sponsoredContent.findUnique({ where: { id } });
    return result ? SponsoredContentMapper.toDomain(result) : null;
  }

  async save(content: SponsoredContent): Promise<void> {
    const data = SponsoredContentMapper.toPersistence(content);
    await this.connector.sponsoredContent.update({
      where: { id: content.id },
      data
    });
  }
}