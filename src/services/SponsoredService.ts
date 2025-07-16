import crypto from 'crypto';
import { SponsoredContent } from '@/domain/entities/Sponsored';
import { CreateSponsorshipDTO, UpdateSponsorshipDaysDTO } from '@/interfaces/dtos/sponsoredDto';
import { ISponsorshipRepository } from '@/domain/repositories/ISponsoredRepository';
import { AppError } from '@/shared/errors/error';

export class SponsorService {
  constructor(private sponsoredRepository: ISponsorshipRepository) {}

  async create(dto: CreateSponsorshipDTO): Promise<SponsoredContent> {
    const pricePerDay = 500;
    const days = dto.days;
    const id = crypto.randomUUID();
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + days);

    const content = new SponsoredContent(
      id,
      dto.refContent,
      dto.refType,
      pricePerDay,
      days,
      startDate,
      endDate,
      dto.filters
    );

    return await this.sponsoredRepository.create(content);
  }

  async list(): Promise<SponsoredContent[]> {
    return await this.sponsoredRepository.listAll();
  }

  async getByType(type: SponsoredContent['type_content']): Promise<SponsoredContent[]> {
    return await this.sponsoredRepository.findByType(type);
  }

  async extendDays(dto: UpdateSponsorshipDaysDTO): Promise<void> {
    const existing = await this.sponsoredRepository.findById(dto.id);

    if (!existing) throw new AppError('Patrocínio não encontrado');

    const content = new SponsoredContent(
      existing.getId(),
      existing.getContentId(),
      existing.getType(),
      existing.getPricePerDay(),
      existing.getDays(),
      existing.getStartDate(),
      existing.getEndDate(),
      existing.getFilters()
    );

    content.extendDays(dto.extraDays);
    await this.sponsoredRepository.save(content);
  }

  async delete(id: string): Promise<void> {
    await this.sponsoredRepository.delete(id);
  }

  async expireOldSponsorships(): Promise<void> {
    const all = await this.sponsoredRepository.listAll();

    if (!all) throw new AppError('Patrocínio não encontrado');

    for (const item of all) {
      const content = new SponsoredContent(
        item.getId(),
        item.getContentId(),
        item.getType(),
        item.getPricePerDay(),
        item.getDays(),
        item.getStartDate(),
        item.getEndDate(),
        item.getFilters()
      );
      if (!content.isActive()) {
        content.expire();
        await this.sponsoredRepository.save(content);
      }
    }
  }
}