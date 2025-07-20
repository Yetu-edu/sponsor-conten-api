import { SponsoredContent, Filters} from "@/domain/entities/Sponsored";

export interface CreateSponsorshipDTO {
  user_id: string;
  refContent: string;
  refType: SponsoredContent['type_content'];
  days: number;
  filters: Filters;
}

export interface UpdateSponsorshipDaysDTO {
  id: string;
  extraDays: number;
}