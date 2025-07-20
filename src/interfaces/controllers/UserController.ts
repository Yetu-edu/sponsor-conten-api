import { Request, Response } from 'express';
import { makeUserService } from '@/interfaces/factories/userFactory';
import z from 'zod';

export class UserController {

  async register(request: Request, response: Response) {
    const createUserSchema = z.object({
        user_ref: z.uuid(),
        email: z.email(),
        password: z.string(),
    });

    try {
        const {
            user_ref,
            email,
            password,
        } = createUserSchema.parse(request.body);

        const service = makeUserService();

        const user = await service.register(
            {
            user_ref,
            email,
            password,
            }
        );

        response.status(201).json(user);
    } catch (error) {
      console.error(error);
      response.status(400).json({ message: 'Erro ao registrar usuário' });
    }
  }

  async login(request: Request, response: Response) {
    const userLoginSchema = z.object({
        email: z.email(),
        password: z.string()
    });
    
    try {
          const {
            email,
            password,
          } = userLoginSchema.parse(request.body);

        const service = makeUserService();

        const userAuth = await service.login(
            {
            email,
            password,
            }
        );

        response.status(200).json(userAuth);
    } catch (error) {
      console.error(error);
      response.status(401).json({ message: 'Credenciais inválidas' });
    }
  }
}