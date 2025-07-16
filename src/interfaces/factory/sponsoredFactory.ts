import { SponsorService } from '@/services/SponsoredService';
import { SponsoredContentRepository } from '@/infra/repositories/SponsoredContentRepository';


export function makeSponsoredContentService() {
  const repositorySponsor = new SponsoredContentRepository();
  return new SponsorService(repositorySponsor);
}