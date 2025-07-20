import { IUserRepository } from '@/domain/repositories/UserRepository';
import { CreateUserDTO, LoginDTO } from '@/interfaces/dtos/UserDto';
import { User } from '@/domain/entities/User';
import {hash, compare} from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { AppError } from '@/shared/errors/error';

export class AuthService {
  constructor(private readonly userRepo: IUserRepository) {}

  async register(data: CreateUserDTO): Promise<User> {
    const existingUser = await this.userRepo.findByEmail(data.email);
    // Verifica se o usuário já existe
    // Se existir, lança um erro de conflito
    if (existingUser) {
      throw new AppError('Usuário já existe', 409);
    }

    const hashed = await hash(data.password, 10);

    const user = new User(randomUUID(), data.user_ref, data.email, hashed);
    
    return await this.userRepo.create(user);
  }

  async login(data: LoginDTO): Promise<{ token: string }> {

    const user = await this.userRepo.findByEmail(data.email);
    
    if (!user) throw new AppError('Credenciais inválidas', 401);

    const match = await compare(data.password, user.password);

    if (!match) throw new AppError('Credenciais inválidas', 401);

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    return { token };
  }
}