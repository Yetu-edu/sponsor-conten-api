import { Subscription } from "@/domain/entities/Subscription";

export interface ISubscriptionRepository{
    findActiveByUserId(userId: string): Promise<Subscription | null>;
    save(subscription: Subscription): Promise<void>;
}