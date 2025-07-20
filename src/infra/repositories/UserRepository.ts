
import { prisma } from '@/infra/database/prisma';
import { IUserRepository } from '@/domain/repositories/UserRepository';
import { User } from '@/domain/entities/User';

export class PrismaUserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const created = await prisma.user.create({
      data: {
        id: user.id,
        user_ref: user.user_ref,
        email: user.email,
        password: user.password,
        created_at: user.created_at,
      },
    });

    return new User(
      created.id,
      created.user_ref,
      created.email,
      created.password,
      created.created_at
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({ where: { email } });

    return user ? new User(
      user.id,
      user.user_ref,
      user.email,
      user.password,
      user.created_at
    ) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });

    return user ? new User(
      user.id,
      user.user_ref,
      user.email,
      user.password,
      user.created_at
    ) : null;
  }
}