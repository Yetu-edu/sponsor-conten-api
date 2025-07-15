import { SponsoredContent } from '@/domain/entities/Sponsored';
import { SponsoredContent as PrismaSponsoredContent } from '@prisma/client';

export class SponsoredContentMapper {
  static toDomain(data: PrismaSponsoredContent): SponsoredContent {
    return new SponsoredContent(
      data.id,
      data.user_id,
      data.type,
      data.content,
      data.start_date,
      data.end_date,
      data.status,
    );
  }

  static toPersistence(content: SponsoredContent) {
    return {
      id: content.id,
      user_id: content.user_id,
      type: content.type,
      content: content.content,
      start_date: content.start_date,
      end_date: content.end_date,
      status: content.status,
    };
  }
}
