import { VerificationSealService } from '@/services/VerifySealService';
import { VerificationSealRepository } from '@/infra/repositories/VerifySealRepository';


export function makeVerifySealService() {
  const repositorySponsor = new VerificationSealRepository();
  return new VerificationSealService(repositorySponsor);
}