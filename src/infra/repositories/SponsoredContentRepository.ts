import { prisma } from '@/infra/database/prisma';
import { ISponsorshipRepository } from '@/domain/repositories/ISponsoredRepository';
import { SponsoredContent, SponsoredContentType, Filters } from '@/domain/entities/Sponsored';
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
        user_id: persistenceData.user_id,
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

  async updateDays(id: string, days: number, newEndDate: Date): Promise<SponsoredContent> {
    const updated = await this.connect.sponsoredContent.update({
      where: { id },
      data: {
        days,
        end_date: newEndDate,
        updated_at: new Date(),
      },
    });
    return SponsoredContentMapper.toDomain(updated);
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

  async findExpiringTomorrow(date: Date): Promise<SponsoredContent[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const records = await prisma.sponsoredContent.findMany({
      where: {
        end_date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        id: true,
        ref_content: true,
        type_content: true,
        price_per_day: true,
        user_id: true,
        days: true,
        start_date: true,
        end_date: true,
        area_of_study: true,
        interest: true,
        localization: true,
        curse: true,
        academic_level: true,
      },
    });

    return records.map(item =>
      new SponsoredContent(
        item.id,
        item.ref_content,
        item.type_content as SponsoredContentType,
        Number(item.price_per_day),
        item.user_id,
        item.days,
        item.start_date,
        item.end_date,
        {
          area_of_study: item.area_of_study,
          interest: item.interest,
          localization: item.localization,
          curse: item.curse,
          academic_level: item.academic_level
        }
      )
    );
  }
}