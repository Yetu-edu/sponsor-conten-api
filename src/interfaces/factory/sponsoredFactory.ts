import { SponsoredService } from '@/services/SponsoredService';
import { MongooseSponsoredContentRepository } from '@/infra/repositories/SponsoredContentRepository';
import { MongooseSubscriptionRepository } from "@/infra/repositories/SubscriptionRepository";

export function makeSponsoredContentService() {
  const repositorySponsor = new MongooseSponsoredContentRepository();
  const repositorySubscription = new MongooseSubscriptionRepository()
  return new SponsoredService(repositorySponsor, repositorySubscription);
}