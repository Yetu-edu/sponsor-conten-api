// src/infra/repositories/prisma/PrismaVerificationSealRepository.ts

import { prisma } from '@/infra/database/prisma';
import { VerificationSeal } from '@/domain/entities/VerificationSeal';
import { VerificationSealMapper } from '@/infra/mappers/verifyMapper';
import {
  IVerificationSealRepository
} from '@/domain/repositories/IVerifySealRepository';

export class VerificationSealRepository implements IVerificationSealRepository {
  private connect = prisma;

  async create(entity: VerificationSeal) {
    const data = VerificationSealMapper.toPersistence(entity);

    const created = await this.connect.verificationSeal.create({ data });

    return VerificationSealMapper.toDomain(created);
  }

  async findByUserId(user_id: string) {
    const seal = await this.connect.verificationSeal.findUnique({
      where: { user_id },
    });

    return seal ? VerificationSealMapper.toDomain(seal) : null;
  }

  async update(entity: VerificationSeal) {
    const data = VerificationSealMapper.toPersistence(entity);

    const updated = await this.connect.verificationSeal.update({
      where: { user_id: entity.user_id },
      data: { is_verified: entity.is_verified },
    });

    return VerificationSealMapper.toDomain(updated);
  }

  async getAll() {
    const all = await this.connect.verificationSeal.findMany();
    return all.map(VerificationSealMapper.toDomain);
  }
}
