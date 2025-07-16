// tests/services/VerificationSealService.spec.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { VerificationSealService } from '@/services/VerifySealService';
import { InMemoryVerificationSealRepository } from '@/infra/repositories/implementation/InmemoriVerificationRepository';
import { AppError } from '@/shared/errors/error';

let service: VerificationSealService;
let repo: InMemoryVerificationSealRepository;

describe('VerificationSealService', () => {
  beforeEach(() => {
    repo = new InMemoryVerificationSealRepository();
    service = new VerificationSealService(repo);
  });

  it('deve criar um selo de verificação para um usuário', async () => {
    const seal = await service.create('user-1');

    expect(seal).toBeDefined();
    expect(seal.user_id).toBe('user-1');
    expect(seal.is_verified).toBe(false);
  });

  it('não deve criar dois selos para o mesmo usuário', async () => {
    await service.create('user-2');

    await expect(() => service.create('user-2')).rejects.toThrowError(
      'O selo de verificação já existe para este usuário.'
    );
  });

  it('deve verificar um usuário', async () => {
    await service.create('user-3');

    const updated = await service.verifyUser('user-3');

    expect(updated.is_verified).toBe(true);
  });

  it('deve lançar erro ao tentar verificar um usuário sem selo', async () => {
    await expect(() => service.verifyUser('user-4')).rejects.toThrowError(
      'Selo não encontrado para este usuário.'
    );
  });

  it('deve remover a verificação de um usuário', async () => {
    await service.create('user-5');
    await service.verifyUser('user-5');

    const updated = await service.unverifyUser('user-5');

    expect(updated.is_verified).toBe(false);
  });

  it('deve retornar null se o usuário não tiver selo', async () => {
    const result = await service.findByUserId('user-6');
    expect(result).toBeNull();
  });

  it('deve retornar true se o usuário estiver verificado', async () => {
    await service.create('user-7');
    await service.verifyUser('user-7');

    const result = await service.isUserVerified('user-7');
    expect(result).toBe(true);
  });

  it('deve retornar false se o usuário não estiver verificado', async () => {
    await service.create('user-8');

    const result = await service.isUserVerified('user-8');
    expect(result).toBe(false);
  });

  it('deve retornar todos os selos', async () => {
    await service.create('user-9');
    await service.create('user-10');

    const result = await service.getAll();

    expect(result?.length ?? 0).toBe(2);
  });
});