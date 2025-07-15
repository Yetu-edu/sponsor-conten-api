import { prisma } from '@/infra/database/prisma';
import { Subscription } from '@/domain/entities/Subscription';
import { ISubscriptionRepository } from '@/domain/repositories/ISubscriptionRepository';
import { SubscriptionMapper } from "@/infra/mappers/SubscriptionMapper";

export class MongooseSubscriptionRepository implements ISubscriptionRepository {
  private connector = prisma;

  async findActiveByUserId(userId: string): Promise<Subscription | null> {
        const result = await this.connector.subscription.findFirst({
            where: {
            user_id: userId,
            status: 'active',
            expires_at: {
                gt: new Date(),
            },
            },
        });

        return result ? SubscriptionMapper.toDomain(result) : null;
    }

    async save(subscription: Subscription): Promise<void> {
    const data = SubscriptionMapper.toPersistence(subscription);

    await this.connector.subscription.create({
      data,
    });
  }
}