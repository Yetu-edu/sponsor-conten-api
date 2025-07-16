import { VerificationSeal } from "@/domain/entities/VerificationSeal"

export interface IVerificationSealRepository {
  create(data:VerificationSeal): Promise<VerificationSeal>;
  findByUserId(user_id: string): Promise<VerificationSeal | null>;
  update(data: VerificationSeal): Promise<VerificationSeal>;
  getAll(): Promise<VerificationSeal[] | null>;
}