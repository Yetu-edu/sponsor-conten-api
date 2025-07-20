import crypto from 'crypto';
import { SponsoredContent } from '@/domain/entities/Sponsored';
import { CreateSponsorshipDTO, UpdateSponsorshipDaysDTO } from '@/interfaces/dtos/sponsoredDto';
import { ISponsorshipRepository } from '@/domain/repositories/ISponsoredRepository';
import { AppError } from '@/shared/errors/error';
import { publishEvent } from "@/shared/message-broker/rabbit";

export class SponsorService {
  constructor(private sponsoredRepository: ISponsorshipRepository) {}

  async create(dto: CreateSponsorshipDTO): Promise<{ sponsoredContent: SponsoredContent; totalPrice: number }> {
    const pricePerDay = 500;
    const days = dto.days;
    const id = crypto.randomUUID();
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + days);

    const content = new SponsoredContent(
      id,
      dto.refContent,
      dto.refType,
      pricePerDay,
      dto.user_id,
      days,
      startDate,
      endDate,
      dto.filters
    );

    //Calcular o valor a pagar de acordo com os dias
    const totalPrice = content.getTotalPrice();

    if (totalPrice <= 0) {
      throw new AppError('Valor total do patrocínio deve ser maior que zero', 400);
    }
    

    const result = await this.sponsoredRepository.create(content);
    //retornar informações do conteúdo e o valor total a pagar
    if (!result) {  
      throw new AppError('Erro ao criar patrocínio', 500);
    }
    // Publica evento de novo patrocínio
    await publishEvent("sponsorship.created", {
      sponsorshipId: result.getId(),
      userId: result.getUserId(),
      contentId: result.getContentId(),
      totalPrice,
      startDate: content.getStartDate(),
    });

    // Retorna o conteúdo criado e o valor total
    return {
      sponsoredContent: result,
      totalPrice
    };

  }

  async list(): Promise<SponsoredContent[]> {
    return await this.sponsoredRepository.listAll();
  }

  async getByType(type: SponsoredContent['type_content']): Promise<SponsoredContent[]> {
    return await this.sponsoredRepository.findByType(type);
  }

  async extendDays(dto: UpdateSponsorshipDaysDTO) {
    const existing = await this.sponsoredRepository.findById(dto.id);

    if (!existing) throw new AppError('Patrocínio não encontrado', 404);

    const content = new SponsoredContent(
      existing.getId(),
      existing.getContentId(),
      existing.getType(),
      existing.getPricePerDay(),
      existing.getUserId(),
      existing.getDays(),
      existing.getStartDate(),
      existing.getEndDate(),
      existing.getFilters()
    );

      // Atualiza os dias
    content.extendDays(dto.extraDays);

    // Salva no banco
    await this.sponsoredRepository.save(content);

    // Calcula o valor extra a pagar
    const extraCharge = dto.extraDays * content.getPricePerDay();

    const newEndDate = new Date(content.getEndDate());
    // Atualiza a data de término
    newEndDate.setDate(newEndDate.getDate() + dto.extraDays);

    return {
      updated: content,
      extraCharge,
      newEndDate,
    };
  }

  async delete(id: string): Promise<void> {
    const existing = await this.sponsoredRepository.findById(id);

    if (!existing) throw new AppError('Patrocínio não encontrado', 404);
    // Verifica se o patrocínio está ativo
    // Se estiver ativo, não pode ser excluído
    if (existing.isActive()) {
      throw new AppError('Não é possível excluir um patrocínio ativo', 400);
    }

    await this.sponsoredRepository.delete(id);
  }



  async expireOldSponsorships() {
    const today = new Date();

    // 👉 Patrocínios que expiram hoje
    const expiredSponsorships = await this.sponsoredRepository.findExpired(today);

    for (const item of expiredSponsorships) {
      item.expire(); // Atualiza status interno
      await this.sponsoredRepository.save(item);

      // 🔔 Publica evento de patrocínio expirado
      await publishEvent("sponsorship.expired", {
        sponsorshipId: item.getId(),
        userId: item.getUserId(),
        contentId: item.getContentId(),
        expiredAt: today.toISOString(),
      });
    }

    // 👉 Patrocínios que vão expirar amanhã
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const expiringSoon = await this.sponsoredRepository.findExpiringTomorrow(tomorrow);

    for (const item of expiringSoon) {
      // 🔔 Publica evento de patrocínio que vai expirar amanhã
      await publishEvent("sponsorship.expiring_soon", {
        sponsorshipId: item.getId(),
        userId: item.getUserId(),
        contentId: item.getContentId(),
        expiresIn: '1 day',
        expiresAt: item.getEndDate().toISOString(),
      });
    }
  }
}