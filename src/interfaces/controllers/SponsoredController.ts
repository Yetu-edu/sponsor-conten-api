import { z } from 'zod';
import { Request, Response } from 'express';
import { makeSponsoredContentService } from '@/interfaces/factory/sponsoredFactory';

const createSponsorshipSchema = z.object({
  refContent: z.uuid(),
  refType: z.enum(['curso', 'video', 'mentoria', 'produto', 'bolsa', 'paper', 'ticket', 'flick']),
  days: z.number().min(1),
  filters: z.object({
    area_of_study: z.string(),
    interest: z.array(z.string()),
    localization: z.string(),
    curse: z.string(),
    academic_level: z.string()
  })
});

const updateSponsorshipDaysSchema = z.object({
  id: z.string(),
  extraDays: z.number().min(1),
});

const typeQuerySchema = z.object({
  type: z.enum(['curso', 'video', 'mentoria', 'produto', 'bolsa', 'paper', 'ticket', 'flick']),
});

export class SponsorController {

  async create(request: Request, response: Response) {
    try {
      const { days, refContent, refType, filters } = createSponsorshipSchema.parse(request.body);

      const service = makeSponsoredContentService();

      const sponsorship = await service.create({
        days,
        refContent,
        refType,
        filters,
      });

      return response.status(201).send(sponsorship);
    } catch (error) {
      return response.status(400).send({ error: 'Erro ao criar patrocínio', details: error });
    }
  }

  async getAll(request: Request, response: Response) {
    try {
        const service = makeSponsoredContentService();

        const list = await service.list();

        if(!list) return response.status(404).json({message:"Patrocínios não encontrado"})

        return response.status(200).json({list})

    } catch (error) {
      return response.status(500).send({ error: 'Erro ao listar patrocínios' });
    }
  }

  async getByType(request: Request, response: Response) {
    try {
      const { type } = typeQuerySchema.parse(request.query);

      const service = makeSponsoredContentService();
      
      const listByType = await service.getByType(type);

      if(!listByType) return response.status(404).json({message:" Conteúdo não encontrado"})
      
      return response.status(200).json({listByType});
    } catch (error) {
      
      return response.status(400).send({ error: 'Erro ao buscar por tipo', details: error });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const {
        extraDays,
        id
      } = updateSponsorshipDaysSchema.parse(request.body);

      const service = makeSponsoredContentService();

      const exntend_day = await service.extendDays({
        extraDays,
        id
      });

      return response.status(200).json({exntend_day});

    } catch (error) {
      return response.status(400).send({ error: 'Erro ao estender dias', details: error });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const service = makeSponsoredContentService();

      await service.delete(id);

      return response.status(204).json({});
    } catch (error) {
      return response.status(400).send({ error: 'Erro ao excluir patrocínio', details: error });
    }
  }
}
