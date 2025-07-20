import { AuthService } from "@/services/UserService";
import { PrismaUserRepository } from "@/infra/repositories/UserRepository";

export function makeUserService(){
    const repository = new PrismaUserRepository();
    return new AuthService(repository)
}