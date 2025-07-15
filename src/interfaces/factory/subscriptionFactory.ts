import { SubscriptionService } from '@/services/SubscriptionService';
import { MongooseSubscriptionRepository } from "@/infra/repositories/SubscriptionRepository";

export function makeSubscriptionService() {
  const repositorySubscription = new MongooseSubscriptionRepository()
  return new SubscriptionService(repositorySubscription);
}