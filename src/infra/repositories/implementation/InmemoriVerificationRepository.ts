import { VerificationSeal } from '@/domain/entities/VerificationSeal';
import { IVerificationSealRepository } from '@/domain/repositories/IVerifySealRepository';

export class InMemoryVerificationSealRepository implements IVerificationSealRepository {
  private items: VerificationSeal[] = [];

  async create(entity: VerificationSeal): Promise<VerificationSeal> {
    this.items.push(entity);
    return entity;
  }

  async findByUserId(user_id: string): Promise<VerificationSeal | null> {
    const seal = this.items.find(item => item.user_id === user_id);
    return seal ?? null;
  }

  async update(entity: VerificationSeal): Promise<VerificationSeal> {
    const index = this.items.findIndex(item => item.user_id === entity.user_id);
    if (index >= 0) {
      this.items[index] = entity;
      return entity;
    }
    throw new Error('VerificationSeal not found');
  }

  async getAll(): Promise<VerificationSeal[]> {
    return this.items;
  }
}