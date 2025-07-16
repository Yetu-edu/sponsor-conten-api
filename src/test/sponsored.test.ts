import { describe, it, expect, beforeEach } from 'vitest';
import { SponsorService } from '@/services/SponsoredService';
import { InMemorySponsoredContentRepository } from '@/infra/repositories/implementation/InmemorySponsoredRepository';
import { CreateSponsorshipDTO, UpdateSponsorshipDaysDTO } from '@/interfaces/dtos/sponsoredDto';
import { SponsoredContent, Filters } from '@/domain/entities/Sponsored';

describe('SponsorService', () => {
  let service: SponsorService;
  let repository: InMemorySponsoredContentRepository;

  const filters: Filters = {
    area_of_study: '',
    interest: [],
    localization: '',
    curse: '',
    academic_level: '',
};

  beforeEach(() => {
    repository = new InMemorySponsoredContentRepository();
    service = new SponsorService(repository);
  });

  it('deve criar um novo patrocínio', async () => {
    const dto: CreateSponsorshipDTO = {
      refContent: 'content-123',
      refType: 'mentoria',
      days: 5,
      filters: {
            area_of_study: 'tech',
            interest: ['frontend'],
            localization: 'online',
            curse: 'javascript',
            academic_level: 'graduation',
        },
    };

    const result = await service.create(dto);

    expect(result).toBeInstanceOf(SponsoredContent);
    expect(result.getContentId()).toBe(dto.refContent);
    expect(result.getType()).toBe(dto.refType);
    expect(result.getDays()).toBe(dto.days);
    expect(result.getFilters()).toEqual(dto.filters);
  });

  it('deve listar todos os patrocínios', async () => {
    await service.create({
      refContent: 'content-1',
      refType: 'video',
      days: 3,
      filters
    });

    await service.create({
      refContent: 'content-2',
      refType: 'paper',
      days: 2,
      filters
    });

    const all = await service.list();

    expect(all).toHaveLength(2);
  });

  it('deve filtrar patrocínios por tipo', async () => {
    await service.create({
      refContent: 'content-1',
      refType: 'flick',
      days: 3,
     filters
    });

    await service.create({
      refContent: 'content-2',
      refType: 'video',
      days: 2,
      filters
    });

    const flick = await service.getByType('flick');
    const videos = await service.getByType('video');

    expect(flick).toHaveLength(1);
    expect(flick[0].getType()).toBe('flick');
    expect(videos).toHaveLength(1);
    expect(videos[0].getType()).toBe('video');
  });

  it('deve estender os dias de um patrocínio existente', async () => {
    const created = await service.create({
      refContent: 'content-extend',
      refType: 'video',
      days: 5,
      filters
    });

    const updateDto: UpdateSponsorshipDaysDTO = {
      id: created.getId(),
      extraDays: 3,
    };

    await service.extendDays(updateDto);

    const updated = await repository.findById(created.getId());
    expect(updated?.getDays()).toBe(8);
  });

  it('deve lançar erro ao tentar estender um patrocínio inexistente', async () => {
    const updateDto: UpdateSponsorshipDaysDTO = {
      id: 'non-existent-id',
      extraDays: 3,
    };

    await expect(() => service.extendDays(updateDto)).rejects.toThrowError('Patrocínio não encontrado');
  });

  it('deve deletar um patrocínio', async () => {
    const created = await service.create({
      refContent: 'content-delete',
      refType: 'produto',
      days: 2,
      filters: {
            area_of_study: 'tech',
            interest: ['frontend'],
            localization: 'online',
            curse: 'javascript',
            academic_level: 'graduation',
        },
    });

    await service.delete(created.getId());

    const found = await repository.findById(created.getId());
    expect(found).toBeNull();
  });

  it('deve expirar patrocínios com data final ultrapassada', async () => {
    const pastStart = new Date();
    pastStart.setDate(pastStart.getDate() - 10);

    const pastEnd = new Date();
    pastEnd.setDate(pastEnd.getDate() - 5);

    const expiredContent = new SponsoredContent(
      'expired-id',
      'old-content',
      'paper',
      100,
      5,
      pastStart,
      pastEnd,
       {
        area_of_study: '',
        interest: [],
        localization: '',
        curse: '',
        academic_level: '',
        }
    );

    await repository.create(expiredContent);
    await service.expireOldSponsorships();

    const updated = await repository.findById('expired-id');
    expect(updated?.isActive()).toBe(false);
  });
});