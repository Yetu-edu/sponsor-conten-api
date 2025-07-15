import { ISubscriptionRepository } from '@/domain/repositories/ISubscriptionRepository';
import { Subscription } from '@/domain/entities/Subscription';

export class InMemorySubscriptionRepository implements ISubscriptionRepository {
  private subscriptions: Subscription[] = [];

  async findActiveByUserId(userId: string): Promise<Subscription | null> {
    const now = new Date();

    return (
      this.subscriptions.find(
        (sub) =>
          sub.user_id === userId &&
          sub.status === 'active' &&
          sub.expires_at > now
      ) ?? null
    );
  }

  async save(subscription: Subscription): Promise<void> {
    this.subscriptions.push(subscription);
  }
}