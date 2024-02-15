import { Inject } from '@nestjs/common';
import { CreateAuthDto, CreateAuthRepository } from '@workspaces/domain';
import { PrismaService } from 'nestjs-prisma';

export class CreateAuthRepositoryImpl implements CreateAuthRepository {
  constructor(@Inject('PrismaService') private prismaService: PrismaService) {}

  async create(input: CreateAuthDto): Promise<void> {
    await this.prismaService.auth.create({
      data: {
        email: input.email,
        password: input.password,
        user_id: input.user_id,
      },
    });

    return undefined;
  }
}
