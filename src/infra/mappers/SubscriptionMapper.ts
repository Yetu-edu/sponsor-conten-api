import { Subscription } from '@/domain/entities/Subscription';
import { Subscription as PrismaSubscription } from '@prisma/client';
import { SubscriptionDTO } from '@/interfaces/dtos/subscriptionDto';

export class SubscriptionMapper {
  static toDomain(raw: PrismaSubscription): Subscription {
    return new Subscription(
      {
        user_id: raw.user_id,
        plan: raw.plan,
        status: raw.status,
        created_at: raw.created_at,
        expires_at: raw.expires_at
      },
      raw.id
    );
  }

  static toPersistence(subscription: Subscription): PrismaSubscription {
    return {
      id: subscription.id!,
      user_id: subscription.user_id,
      plan: subscription.plan,
      status: subscription.status,
      created_at: subscription.created_at,
      expires_at: subscription.expires_at
    };
  }

  static toDTO(subscription: Subscription): SubscriptionDTO {
    return {
      id: subscription.id!,
      user_id: subscription.user_id,
      plan: subscription.plan,
      status: subscription.status,
      created_at: subscription.created_at,
      expires_at: subscription.expires_at
    };
  }
}