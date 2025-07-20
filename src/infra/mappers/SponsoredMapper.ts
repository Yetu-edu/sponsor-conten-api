import { SponsoredContent, SponsoredContentType } from '@/domain/entities/Sponsored';
import { SponsoredContent as PrismaSponsoredContent } from '@prisma/client';
export class SponsoredContentMapper {
  static toDomain(data: PrismaSponsoredContent): SponsoredContent {

    return new SponsoredContent(
      data.id,
      data.ref_content,
      data.type_content as SponsoredContent['type_content'],
      Number(data.price_per_day),
      data.user_id,
      data.days,
      new Date(data.start_date),
      new Date(data.end_date),
      {
        area_of_study: data.area_of_study,
        interest: data.interest,
        localization: data.localization,
        curse: data.curse,
        academic_level: data.academic_level,
      },
    );
  }

  static toPersistence(entity: SponsoredContent) {
    return {
      id: entity.getId(),
      ref_content: entity.getContentId(),
      type_content: entity.getType(),
      price_per_day: entity.getPricePerDay(),
      user_id: entity.getUserId(),
      days: entity.getDays(),
      total_price: entity.getTotalPrice(),
      start_date: entity.getStartDate(),
      end_date: entity.getEndDate(),
      area_of_study: entity.getFilters().area_of_study,
      interest: entity.getFilters().interest,
      localization: entity.getFilters().localization,
      curse: entity.getFilters().curse,
      academic_level: entity.getFilters().academic_level,
      created_at: entity.getCreatedAt(),
      updated_at: entity.getUpdatedAt(),
    };
  }
}