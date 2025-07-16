import { VerificationSeal } from '@/domain/entities/VerificationSeal';
import { IVerificationSealRepository } from '@/domain/repositories/IVerifySealRepository';
import { AppError } from '@/shared/errors/error';
import { randomUUID } from 'crypto';

export class VerificationSealService {
  constructor(private readonly verificationSealRepository: IVerificationSealRepository) {}

  async create(user_id: string): Promise<VerificationSeal> {
    const existing = await this.verificationSealRepository.findByUserId(user_id);

    if (existing) {
      throw new Error('O selo de verificação já existe para este usuário.');
    }

    const seal = new VerificationSeal(
      randomUUID(),
      user_id,
      false,
      new Date()
    );

    return await this.verificationSealRepository.create(seal);
  }

  async verifyUser(user_id: string): Promise<VerificationSeal> {
    const seal = await this.verificationSealRepository.findByUserId(user_id);

    if (!seal) {
      throw new AppError('Selo não encontrado para este usuário.');
    }

    seal.verify();

    return await this.verificationSealRepository.update(seal);
  }

  async unverifyUser(user_id: string): Promise<VerificationSeal> {
    const seal = await this.verificationSealRepository.findByUserId(user_id);

    if (!seal) {
      throw new AppError('Selo não encontrado para este usuário.');
    }

    seal.unverify();

    return await this.verificationSealRepository.update(seal);
  }

  async findByUserId(user_id: string): Promise<VerificationSeal | null> {
    return await this.verificationSealRepository.findByUserId(user_id);
  }

  async isUserVerified(user_id: string): Promise<boolean> {
    const seal = await this.verificationSealRepository.findByUserId(user_id);
    
    return seal ? seal.is_verified : false;
  }

  async getAll() {
    return await this.verificationSealRepository.getAll();
  }
}