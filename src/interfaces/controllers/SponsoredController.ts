import { Request, Response } from 'express';
import { makeSponsoredContentService } from '@/interfaces/factory/sponsoredFactory';
import z, { ZodError } from 'zod';
import { BadRequest } from '@/shared/errors/error';

const sponsoredContentSchema = z.object({
  content: z.string(),
  type: z.enum(['badge', 'post']),
});

const sponsoredContentTypeSchema = z.object({
  type: z.enum(['badge', 'post']),
});

const service = makeSponsoredContentService();

export class SponsoredContentController {
  async create(request: Request, response: Response) {
    try {
       const {
        content,
        type
       } = sponsoredContentSchema.parse(request.body);

       const user_id = request.user.id;

        const created = await service.create({
          user_id,
          content,
          type
        });
        return response.status(201).json(created);
    } catch (error) {
      
      if(error instanceof ZodError){
        return response.status(400).json({message: error.message})
      }

      if(error instanceof BadRequest){
        return response.status(400).json({message: error.message})
      }

    }
  }

  async list(request: Request, response: Response) {
    try {
        const { type } = sponsoredContentTypeSchema.parse(request.query);
    
        const contents = await service.getActiveContents(type);

        if(!contents) return response.status(404).json({message: "Content not found!"})

        return response.status(200).json(contents);
    } catch (error) {
        if(error instanceof BadRequest){
          return response.status(400).json({message: error.message})
        }
    }
  }
};