import {  VerificationSeal } from '@/domain/entities/VerificationSeal';
import { verificationSeal as PrismaVerificationSeal } from '@prisma/client';

export class VerificationSealMapper {
  static toDomain(raw: PrismaVerificationSeal): VerificationSeal {
    return new VerificationSeal(
      raw.id,
      raw.user_id,
      raw.is_verified,
      raw.createdAt
    );
  }

  static toPersistence(entity: VerificationSeal) {
    return {
      id: entity.id,
      user_id: entity.user_id,
      is_verified: entity.is_verified,
      createdAt: entity.createdAt,
    };
  }
}