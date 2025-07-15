
import { Subscription } from '@/domain/entities/Subscription';
import { ISubscriptionRepository } from '@/domain/repositories/ISubscriptionRepository';

interface CreateSubscriptionRequest {
  user_id: string;
  plan: 'basic' | 'premium' | 'enterprise';
}

export class SubscriptionService {
  constructor(private subscriptionRepo: ISubscriptionRepository) {}

  async execute({ user_id, plan }: CreateSubscriptionRequest) {
    const expires_at = this.calculateExpiration(plan);

    const subscription = new Subscription({
      user_id,
      plan,
      status: 'active',
      expires_at
    });

    await this.subscriptionRepo.save(subscription);

    return subscription;
  }

  private calculateExpiration(plan: string): Date {
    const now = new Date();
    now.setMonth(now.getMonth() + 1); 
    return now;
  }
}