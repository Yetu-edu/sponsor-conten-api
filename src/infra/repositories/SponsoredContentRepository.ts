import { prisma } from '@/infra/database/prisma';
import { ISponsorshipRepository } from '@/domain/repositories/ISponsoredRepository';
import { SponsoredContent } from '@/domain/entities/Sponsored';
import { SponsoredContentMapper } from '@/infra/mappers/SponsoredMapper';

export class SponsoredContentRepository implements ISponsorshipRepository {
  private connect = prisma;


  async create(data: SponsoredContent): Promise<SponsoredContent> {
    const persistenceData = SponsoredContentMapper.toPersistence(data);

    const created = await this.connect.sponsoredContent.create({
      data: {
        ...persistenceData,
        price_per_day: persistenceData.price_per_day,
        total_price: persistenceData.total_price,
        created_at: persistenceData.created_at,
        updated_at: persistenceData.updated_at,
      },
    });

    return SponsoredContentMapper.toDomain(created);
  }

  async findById(id: string): Promise<SponsoredContent | null> {
    const data = await this.connect.sponsoredContent.findUnique({
      where: { id },
    });

    if (!data) return null;

    return SponsoredContentMapper.toDomain(data);
  }

  async findByType(type: SponsoredContent['type_content']): Promise<SponsoredContent[]> {
    const data = await this.connect.sponsoredContent.findMany({
      where: {
        type_content: type,
      },
    });

    return data.map(SponsoredContentMapper.toDomain);
  }

  async listAll(): Promise<SponsoredContent[]> {
    const data = await this.connect.sponsoredContent.findMany();
    return data.map(SponsoredContentMapper.toDomain);
  }

  async updateDays(id: string, days: number, newEndDate: Date): Promise<void> {
    await this.connect.sponsoredContent.update({
      where: { id },
      data: {
        days,
        end_date: newEndDate,
        updated_at: new Date(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.connect.sponsoredContent.delete({
      where: { id },
    });
  }

  async findExpired(currentDate: Date): Promise<SponsoredContent[]> {
    const expired = await this.connect.sponsoredContent.findMany({
      where: {
        end_date: {
          lt: currentDate,
        },
      },
    });

    return expired.map(SponsoredContentMapper.toDomain);
  }

    async save(data: SponsoredContent): Promise<void> {
    const persistenceData = SponsoredContentMapper.toPersistence(data);

    await this.connect.sponsoredContent.update({
      where: { id: persistenceData.id },
      data: {
        days: persistenceData.days,
        end_date: persistenceData.end_date,
        updated_at: new Date(),
      },
    });
  }
}