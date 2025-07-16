import { Request, Response } from 'express';
import { z } from 'zod';
import { makeVerifySealService } from '@/interfaces/factories/verifySealFactory';
import { AppError } from '@/shared/errors/error';

export class VerificationSealController {
  async create(request: Request, response: Response) {
    const schema = z.object({
      user_id: z.uuid(),
    });

    try {
      const { user_id } = schema.parse(request.body);
      const service = makeVerifySealService();

      const seal = await service.create(user_id);

      if(!seal) return response.status(404).json({message:"Selo não encontrado"})

      return response.status(201).json({seal});
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(400).json({ message: error.message });
      }
      return response.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async verify(request: Request, response: Response) {
    const schema = z.object({
      user_id: z.uuid(),
    });

    try {
      const { user_id } = schema.parse(request.body);
      const service = makeVerifySealService();

      const seal = await service.verifyUser(user_id);

      if(!seal) return response.status(404).json({message:"Selo não encontrado"})

      return response.status(200).json(seal);
    } catch (error) {
      
        if (error instanceof AppError) return response.status(400).send({ message: error.message });
      
        return response.status(500).send({ message: 'Erro interno do servidor' });
    }
  }

  async unverify(request: Request, response: Response) {
    const schema = z.object({
      user_id: z.uuid(),
    });

    try {
      const { user_id } = schema.parse(request.body);
      const service = makeVerifySealService();

      const seal = await service.unverifyUser(user_id);

      if(!seal) return response.status(404).json({message:"Selo não encontrado"})

      return response.status(200).json({seal});
    } catch (error) {
      
      if (error instanceof AppError) return response.status(400).json({ message: error.message });
      
      return response.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async findByUserId(request: Request, response: Response) {
    const schema = z.object({
      user_id: z.uuid(),
    });

    try {
      const { user_id } = schema.parse(request.params);

      const service = makeVerifySealService();

      const seal = await service.findByUserId(user_id);

       if(!seal) return response.status(404).json({message:"Selo não encontrado"})

      return response.status(200).json({seal});
    } catch(error) {
      if (error instanceof AppError) return response.status(400).json({ message: error.message });
      
      return response.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async isVerified(request: Request, response: Response) {
    const schema = z.object({
      user_id: z.uuid(),
    });

    try {
      const { user_id } = schema.parse(request.params);
      const service = makeVerifySealService();

      const result = await service.isUserVerified(user_id);

      if(!result) return response.status(404).json({message:"Selo não encontrado"})

      return response.status(200).json({ isVerified: result });
    } catch(error) {

      if (error instanceof AppError) return response.status(400).json({ message: error.message });
      
      return response.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async getAll(request: Request, response: Response) {
    try {
      const service = makeVerifySealService();

      const seals = await service.getAll();

      if(!seals) return response.status(404).json({message:"Selos não encontrado"})

      return response.status(200).json({seals});
    } catch (error){

     if (error instanceof AppError) return response.status(400).json({ message: error.message });
        
      return response.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}